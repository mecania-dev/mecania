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
    not_allowed_filters = ["distance_min", "distance_max"]
    queryset = User.objects.filter(groups__name="Mechanic")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query_params: dict = self.request.query_params
        distance_min = query_params.get("distance_min", None)
        distance_max = query_params.get("distance_max", None)
        lat = query_params.get("lat", None)
        lon = query_params.get("lon", None)

        queryset = super().get_queryset()

        if distance_min and distance_max and lat and lon:
            try:
                lat, lon = float(lat), float(lon)
                distance_min, distance_max = float(distance_min), float(distance_max)
            except ValueError:
                return queryset

            filtered_mechanics = []

            for mechanic in queryset:
                for address in mechanic.addresses.all():
                    if address.latitude and address.longitude:
                        calculated_distance = address.get_distance(lat, lon)
                        # Check if the address is within the specified distance range
                        if distance_min <= calculated_distance <= distance_max:
                            filtered_mechanics.append(mechanic.id)
                            break  # Stop further checks for this mechanic once a match is found

            # Return only mechanics within the specified distance range
            queryset = queryset.filter(id__in=filtered_mechanics)

        return queryset


class DriversListView(DynamicQuerysetMixin, generics.ListAPIView):
    queryset = User.objects.filter(groups__name="Driver")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
