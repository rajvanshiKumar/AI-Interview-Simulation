from django.db import models
from django.contrib.auth.models import User

class InterviewSession(models.Model):
    ROLE_CHOICES = [
        ('Frontend', 'Frontend Developer'),
        ('Backend', 'Backend Developer'),
        ('Fullstack', 'Full Stack Developer'),
        ('HR', 'HR Interview'),
        ('DSA', 'DSA / Problem Solving'),
    ]
    
    LEVEL_CHOICES = [
        ('Fresher', 'Fresher'),
        ('Intermediate', 'Intermediate'),
        ('Senior', 'Senior'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    role = models.CharField(max_length=100)
    level = models.CharField(max_length=100)
    selected_questions = models.JSONField(default=list) # Store the 5 random questions
    resume_text = models.TextField(blank=True, null=True)
    overall_score = models.IntegerField(default=0)
    summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role} ({self.created_at.date()})"

class QuestionResponse(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='responses')
    question_text = models.TextField()
    answer_text = models.TextField(blank=True, null=True)
    grammar_score = models.IntegerField(default=0)
    confidence_score = models.IntegerField(default=0)
    content_score = models.IntegerField(default=0)
    feedback_good = models.TextField(blank=True, null=True)
    feedback_improve = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Response to: {self.question_text[:30]}..."
