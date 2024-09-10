from rest_framework import serializers
from django.contrib.auth.models import Group

from .models import User
from addresses.serializers import AddressSerializer
from vehicles.serializers import VehicleSerializer
from services.serializers import ServiceSerializer

class UserRetrieveDestroySerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    addresses = AddressSerializer(many=True, read_only=True)
    vehicles = VehicleSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone_number', 'fiscal_identification', 'avatar_url',
            'last_login', 'is_superuser', 'is_staff', 'is_active',
            'date_joined', 'updated_at', 'groups', 'addresses', 'vehicles', 'services'
        ]

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

class UserCreateUpdateSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(many=True, slug_field='name', queryset=Group.objects.all())

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id', 'updated_at']

    def validate(self, data):
        request = self.context.get('request')
        group_names = [group.name for group in data.get('groups', [])]
        errors = {}

        if 'Mechanic' in group_names and request and request.method != 'PATCH':
            if not data.get('fiscal_identification'):
                errors['fiscal_identification'] = 'This field is required for mechanics.'
            if not data.get('phone_number'):
                errors['phone_number'] = 'This field is required for mechanics.'

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)
        return representation
