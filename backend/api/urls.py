from django.urls import path
from .views import health_check, create_session, submit_answer, get_session_results, RegisterView, get_dashboard_data
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('session/create/', create_session, name='create_session'),
    path('session/<int:session_id>/submit/', submit_answer, name='submit_answer'),
    path('session/<int:session_id>/results/', get_session_results, name='get_results'),
    path('dashboard/', get_dashboard_data, name='dashboard_data'),
]
