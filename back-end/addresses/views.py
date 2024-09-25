from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Address
from .serializers import AddressSerializer, AddressCreateUpdateSerializer
from users.models import User
from users.permissions import IsSelfOrAdmin, IsInGroups
from utils.mixins import FiltersMixin

# REMOVE PAGINATION_CLASS = NONE WHEN FRONT END IS READY


class UserAddressesView(FiltersMixin, generics.GenericAPIView):
    pagination_class = None

    def get_permissions(self):
        return [IsSelfOrAdmin("user_id"), IsInGroups(["Mechanic"])]

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        user = get_object_or_404(User, id=user_id)
        return Address.objects.filter(id__in=user.addresses.values_list("id", flat=True))

    def get_serializer_class(self):
        if self.request.method in ["GET"]:
            return AddressSerializer
        return AddressCreateUpdateSerializer

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        addresses = user.addresses.all()
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        address = serializer.save(user=user)
        return Response(self.get_serializer(address).data, status=status.HTTP_201_CREATED)

    def put(self, request, user_id, address_id):
        user = get_object_or_404(User, id=user_id)
        address = get_object_or_404(Address, id=address_id, user=user)
        serializer = self.get_serializer(address, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated_address = serializer.save()
        return Response(self.get_serializer(updated_address).data, status=status.HTTP_200_OK)

    def delete(self, request, user_id, address_id):
        user = get_object_or_404(User, id=user_id)
        address = get_object_or_404(Address, id=address_id, user=user)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
