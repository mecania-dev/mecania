from django.urls import path, include
from .views import RegisterView, MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    path('rest-framework/', include('rest_framework.urls')),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh-token/', MyTokenRefreshView.as_view(), name='refresh-token'),
]
