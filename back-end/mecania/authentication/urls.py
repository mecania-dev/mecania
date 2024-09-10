from django.urls import path, include
from .views import RegisterView, MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    path('rest-framework/', include('rest_framework.urls')),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
]
