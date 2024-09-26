from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Category, Service
from .serializers import CategorySerializer, ServiceRetrieveDestroySerializer, ServiceCreateUpdateSerializer
from users.models import User
from users.permissions import IsSelfOrAdmin, IsInGroups
from utils.mixins import FiltersMixin

# REMOVE PAGINATION_CLASS = NONE WHEN FRONT END IS READY


class CategoryListCreateView(FiltersMixin, generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]


class CategoryRetrieveUpdateDestroyView(FiltersMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]


class ServiceListCreateView(FiltersMixin, generics.ListCreateAPIView):
    queryset = Service.objects.all()
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ServiceRetrieveDestroySerializer
        return ServiceCreateUpdateSerializer


class ServiceRetrieveUpdateDestroyView(FiltersMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ServiceRetrieveDestroySerializer
        return ServiceCreateUpdateSerializer


class UserServicesView(FiltersMixin, generics.GenericAPIView):
    pagination_class = None

    def get_permissions(self):
        return [IsSelfOrAdmin("user_id"), IsInGroups(["Mechanic"])]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ServiceCreateUpdateSerializer
        return ServiceRetrieveDestroySerializer

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        user = get_object_or_404(User, id=user_id)
        return Service.objects.filter(id__in=user.services.values_list("id", flat=True))

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        services = user.services.all()
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        service_ids = request.data.get("services", [])

        # Validate the service_ids are valid
        services = Service.objects.filter(id__in=service_ids)
        if len(services) != len(service_ids):
            return Response({"error": "One or more service IDs are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        # Add services to the user
        user.services.add(*services)
        return Response({"message": "Services added successfully."}, status=status.HTTP_200_OK)

    def delete(self, request, user_id, service_id=None):
        user = get_object_or_404(User, id=user_id)

        if service_id:
            service = get_object_or_404(Service, id=service_id)
            user.services.remove(service)
            return Response({"message": "Service removed successfully."}, status=status.HTTP_200_OK)
        else:
            # If no service_id is provided, clear all services
            user.services.clear()
            return Response({"message": "All services removed successfully."}, status=status.HTTP_200_OK)
