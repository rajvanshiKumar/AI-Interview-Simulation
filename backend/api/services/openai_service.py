import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_resume_questions(resume_text, role, count=3):
    """
    Generates tailored interview questions based on resume content.
    """
    prompt = f"""
    Analyze the following resume for a {role} position.
    Resume Content: {resume_text}
    
    Generate {count} high-quality, professional interview questions based on the candidate's specific projects, skills, and work history mentioned in the resume. 
    Return only a JSON array of strings.
    Example: ["Question 1", "Question 2", "Question 3"]
    """
    try:
        if not os.getenv("OPENAI_API_KEY") or "your-open" in os.getenv("OPENAI_API_KEY"):
            return [f"Tell me more about your work in {role} as described in your resume.", "What was the biggest technical challenge in your last project?"]

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional technical recruiter."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        data = json.loads(response.choices[0].message.content)
        # Handle different possible JSON structures from AI
        if isinstance(data, dict):
            return list(data.values())[0] if isinstance(list(data.values())[0], list) else ["No questions generated"]
        return data
    except Exception as e:
        print(f"Error generating resume questions: {e}")
        return ["Describe a project from your resume.", "What is your core expertise?"]

def evaluate_answer(question, answer):
    """
    Evaluates an interview answer using GPT-4o.
    Returns scores and feedback in JSON format.
    """
    prompt = f"""
    You are an expert AI Interviewer. Evaluate the following interview response.
    
    Question: {question}
    User Answer: {answer}
    
    Provide a detailed evaluation in JSON format with the following keys:
    - grammar_score (0-100)
    - confidence_score (0-100, based on tone and phrasing)
    - content_score (0-100, based on technical accuracy and structure)
    - feedback_good (Summary of what was strong)
    - feedback_improve (Summary of what to improve)
    """
    
    try:
        # Check if API key is invalid or placeholder
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or "your-open" in api_key:
             return {
                "grammar_score": 85,
                "confidence_score": 75,
                "content_score": 90,
                "feedback_good": "Excellent structure and clarity (Mock Mode - Add OpenAI Key for AI Feedback).",
                "feedback_improve": "Try to provide more quantitative results in your answers (Mock Mode)."
            }

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional HR and Technical evaluator."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in OpenAI Evaluation: {e}")
        return {
            "grammar_score": 80,
            "confidence_score": 70,
            "content_score": 75,
            "feedback_good": "Good attempt.",
            "feedback_improve": f"AI Evaluation failed: {str(e)}"
        }
