from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User
from .permissions import IsSelfOrAdmin
from .serializers import UserSerializer, UserCreateUpdateSerializer
from utils.mixins import DynamicQuerysetMixin


class UserListCreate(DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserSerializer
        return UserCreateUpdateSerializer


class UserRetrieveUpdateDestroy(DynamicQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    lookup_field = "pk"

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsSelfOrAdmin()]

    def get_serializer_class(self):
        if self.request.method in ["GET", "DELETE"]:
            return UserSerializer
        else:
            return UserCreateUpdateSerializer


class LoggedUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class MechanicsListView(DynamicQuerysetMixin, generics.ListAPIView):
    queryset = User.objects.filter(groups__name="Mechanic")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class DriversListView(DynamicQuerysetMixin, generics.ListAPIView):
    queryset = User.objects.filter(groups__name="Driver")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
