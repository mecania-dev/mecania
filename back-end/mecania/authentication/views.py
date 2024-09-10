from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.models import User
from .serializers import UserRegisterSerializer, UserRetrieveDestroySerializer, MyTokenObtainPairSerializer, MyTokenRefreshSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer

class UserDetailFromToken(generics.RetrieveAPIView):
    serializer_class = UserRetrieveDestroySerializer

    def get_object(self):
        return self.request.user
