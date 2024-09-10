from rest_framework import generics
from .models import User
from .serializers import UserRetrieveDestroySerializer, UserCreateUpdateSerializer

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return UserRetrieveDestroySerializer
        else:
            return UserCreateUpdateSerializer

class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return UserRetrieveDestroySerializer
        else:
            return UserCreateUpdateSerializer
