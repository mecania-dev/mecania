from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Vehicle
from users.models import User

from .serializers import VehicleCreateUpdateSerializer

class VehicleCreateUpdateView(generics.CreateAPIView):
    serializer_class = VehicleCreateUpdateSerializer

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
