from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Vehicle
from .serializers import VehicleSerializer, VehicleCreateUpdateSerializer
from users.models import User
from users.permissions import IsSelfOrAdmin, IsInGroups
from utils.mixins import DynamicQuerysetMixin


class UserVehiclesView(DynamicQuerysetMixin, generics.GenericAPIView):
    def get_permissions(self):
        return [IsSelfOrAdmin("user_id"), IsInGroups(["Driver"])]

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        user = get_object_or_404(User, id=user_id)
        return Vehicle.objects.filter(id__in=user.vehicles.values_list("id", flat=True))

    def get_serializer_class(self):
        if self.request.method in ["GET"]:
            return VehicleSerializer
        return VehicleCreateUpdateSerializer

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        vehicles = user.vehicles.all()
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        vehicle = serializer.save(user=user)
        return Response(self.get_serializer(vehicle).data, status=status.HTTP_201_CREATED)

    def put(self, request, user_id, vehicle_id):
        user = get_object_or_404(User, id=user_id)
        vehicle = get_object_or_404(Vehicle, id=vehicle_id, user=user)
        serializer = self.get_serializer(vehicle, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated_vehicle = serializer.save()
        return Response(self.get_serializer(updated_vehicle).data, status=status.HTTP_200_OK)

    def delete(self, request, user_id, vehicle_id):
        user = get_object_or_404(User, id=user_id)
        vehicle = get_object_or_404(Vehicle, id=vehicle_id, user=user)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
