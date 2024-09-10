from rest_framework import serializers
from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class AddressCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['street', 'number', 'district', 'city', 'state', 'zip_code', 'country', 'complement']

