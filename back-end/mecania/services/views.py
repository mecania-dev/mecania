from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Service
from users.models import User
from .serializers import ServiceSerializer

class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceAddRemoveView(generics.GenericAPIView):

    def post(self, request, user_id):
        """
        Add services to a user.
        Expects a JSON payload with a list of service IDs.
        """
        user = get_object_or_404(User, id=user_id)
        service_ids = request.data.get('services', [])

        # Validate the service_ids are valid
        services = Service.objects.filter(id__in=service_ids)
        if len(services) != len(service_ids):
            return Response({"error": "One or more service IDs are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        # Add services to the user
        user.services.add(*services)
        return Response({"message": "Services added successfully."}, status=status.HTTP_200_OK)

    def delete(self, request, user_id, service_id=None):
        """
        Remove a specific service from a user.
        If no service_id is provided, remove all services.
        """
        user = get_object_or_404(User, id=user_id)

        if service_id:
            service = get_object_or_404(Service, id=service_id)
            user.services.remove(service)
            return Response({"message": "Service removed successfully."}, status=status.HTTP_200_OK)
        else:
            # If no service_id is provided, clear all services
            user.services.clear()
            return Response({"message": "All services removed successfully."}, status=status.HTTP_200_OK)
