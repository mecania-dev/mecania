from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User
from .permissions import IsSelfOrAdmin
from .serializers import UserListSerializer, UserRetrieveDestroySerializer, UserCreateUpdateSerializer
from utils.mixins import FiltersMixin

# REMOVE PAGINATION_CLASS = NONE WHEN FRONT END IS READY


class UserListCreate(FiltersMixin, generics.ListCreateAPIView):
    queryset = User.objects.all()
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserListSerializer
        return UserCreateUpdateSerializer


class UserRetrieveUpdateDestroy(FiltersMixin, generics.RetrieveUpdateDestroyAPIView):
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


class MechanicsListView(FiltersMixin, generics.ListAPIView):
    queryset = User.objects.filter(groups__name="Mechanic")
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]


class DriversListView(FiltersMixin, generics.ListAPIView):
    queryset = User.objects.filter(groups__name="Driver")
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
