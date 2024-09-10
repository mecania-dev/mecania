from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Address
from users.models import User

from .serializers import AddressCreateUpdateSerializer

class AddressCreateUpdateView(generics.CreateAPIView):
    serializer_class = AddressCreateUpdateSerializer

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
