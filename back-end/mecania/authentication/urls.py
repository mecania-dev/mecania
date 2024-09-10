from django.urls import path, include
from . import views

urlpatterns = [
    path('rest-framework/', include('rest_framework.urls')),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),
    path('refresh-token/', views.MyTokenRefreshView.as_view(), name='refresh-token'),
    path("me/", views.UserDetailFromToken.as_view(), name="user-detail-from-token"),
]
