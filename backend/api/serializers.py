from rest_framework import serializers
from .models import InterviewSession, QuestionResponse

class QuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionResponse
        fields = '__all__'

class InterviewSessionSerializer(serializers.ModelSerializer):
    responses = QuestionResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = InterviewSession
        fields = '__all__'
