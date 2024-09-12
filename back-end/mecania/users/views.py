from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import User
from .permissions import IsSelfOrAdmin
from .serializers import UserRetrieveDestroySerializer, UserCreateUpdateSerializer


class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserRetrieveDestroySerializer
        return UserCreateUpdateSerializer


class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    lookup_field = "pk"

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsSelfOrAdmin()]

    def get_serializer_class(self):
        if self.request.method in ["GET", "DELETE"]:
            return UserRetrieveDestroySerializer
        else:
            return UserCreateUpdateSerializer


class LoggedUserView(generics.RetrieveAPIView):
    serializer_class = UserRetrieveDestroySerializer

    def get_object(self):
        return self.request.user
