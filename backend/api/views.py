from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import InterviewSession, QuestionResponse
from .serializers import InterviewSessionSerializer, QuestionResponseSerializer
from .user_serializers import UserSerializer
from .services.openai_service import evaluate_answer, generate_resume_questions
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from .questions_data import QUESTIONS
import random 
from pdfminer.high_level import extract_text
import io
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def health_check(request):
    return Response({"status": "AI Interview Pro Backend is online 🚀"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def create_session(request):
    user = request.user if request.user.is_authenticated else User.objects.get_or_create(username='guest_user')[0]
    
    # Handle both JSON and Form data for resume upload
    role = request.data.get('role', 'Frontend')
    level = request.data.get('level', 'Fresher')
    resume_file = request.FILES.get('resume')
    
    resume_content = ""
    if resume_file:
        try:
            # Extract text from PDF
            resume_content = extract_text(io.BytesIO(resume_file.read()))
        except Exception as e:
            print(f"Error parsing PDF: {e}")

    # --- Question Generation Strategy ---
    # 1. Start with 2 Basic/Introductory Questions
    intro_qs = [
        "Tell me about yourself and your background.",
        f"Why are you interested in a {role} role, and what motivates you to work in this domain?"
    ]
    
    # 2. Get 3 Specialized Questions (Resume-based OR Role-based)
    specialized_qs = []
    if resume_content:
        # Generate 3 resume-based questions
        specialized_qs = generate_resume_questions(resume_content[:2000], role, count=3)
    else:
        # Get 3 random from pool
        role_questions = QUESTIONS.get(role, QUESTIONS['Frontend'])
        specialized_qs = random.sample(role_questions, min(len(role_questions), 3))

    # Combine: 2 Intro + 3 Specialized = 5 Total
    selected = intro_qs + specialized_qs
    
    session = InterviewSession.objects.create(
        user=user,
        role=role,
        level=level,
        selected_questions=selected[:5], # Guaranteed 5 questions
        resume_text=resume_content
    )
    return Response(InterviewSessionSerializer(session).data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def submit_answer(request, session_id):
    try:
        session = InterviewSession.objects.get(id=session_id)
    except InterviewSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        
    data = request.data
    question = data.get('question')
    answer = data.get('answer')
    
    # AI Evaluation
    evaluation = evaluate_answer(question, answer)
    
    response = QuestionResponse.objects.create(
        session=session,
        question_text=question,
        answer_text=answer,
        grammar_score=evaluation.get('grammar_score', 0),
        confidence_score=evaluation.get('confidence_score', 0),
        content_score=evaluation.get('content_score', 0),
        feedback_good=evaluation.get('feedback_good', ''),
        feedback_improve=evaluation.get('feedback_improve', '')
    )
    
    return Response(QuestionResponseSerializer(response).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_session_results(request, session_id):
    try:
        session = InterviewSession.objects.get(id=session_id)
    except InterviewSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate overall score as average of all response scores
    responses = session.responses.all()
    if responses.exists():
        total_score = 0
        for resp in responses:
            # Average of the three scores for each question
            question_avg = (resp.grammar_score + resp.confidence_score + resp.content_score) / 3
            total_score += question_avg
        
        session.overall_score = round(total_score / responses.count())
        session.save()

    return Response(InterviewSessionSerializer(session).data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_dashboard_data(request):
    user = request.user
    interviews = InterviewSession.objects.filter(user=user).order_by('-created_at')
    
    total_interviews = interviews.count()
    avg_score = interviews.aggregate(Avg('overall_score'))['overall_score__avg'] or 0
    
    # Simple improvement calculation: difference between last and first interview score
    if total_interviews >= 2:
        latest = interviews.first().overall_score
        first = interviews.last().overall_score
        improvement = latest - first
    else:
        improvement = 0

    # Practice hours: semi-calculated based on number of interviews (e.g., 15 mins per session)
    practice_hours = round((total_interviews * 15) / 60, 1)

    recent_history = []
    for session in interviews[:5]:
        status_text = "Needs Practice"
        if session.overall_score >= 85:
            status_text = "Excellent"
        elif session.overall_score >= 75:
            status_text = "Very Good"
        elif session.overall_score >= 60:
            status_text = "Good"
            
        recent_history.append({
            "id": session.id,
            "role": session.role,
            "date": session.created_at.strftime("%b %d, %Y"),
            "score": f"{session.overall_score}%",
            "status": status_text
        })

    data = {
        "stats": [
            {"label": "Total Interviews", "value": str(total_interviews), "icon": "Play", "color": "bg-primary"},
            {"label": "Average Score", "value": f"{round(avg_score)}%", "icon": "Award", "color": "bg-success"},
            {"label": "Practice Hours", "value": f"{practice_hours}h", "icon": "Clock", "color": "bg-info"},
            {"label": "Improvement", "value": f"{'+' if improvement >= 0 else ''}{improvement}%", "icon": "TrendingUp", "color": "bg-warning"},
        ],
        "recent_interviews": recent_history,
        "user": {
            "username": user.username,
            "email": user.email
        }
    }
    
    return Response(data)
