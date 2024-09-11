from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import User
from .permissions import IsSelfOrAdmin
from .serializers import UserRetrieveDestroySerializer, UserCreateUpdateSerializer

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return UserRetrieveDestroySerializer
        return UserCreateUpdateSerializer

class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'pk'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsSelfOrAdmin()]

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return UserRetrieveDestroySerializer
        else:
            return UserCreateUpdateSerializer
