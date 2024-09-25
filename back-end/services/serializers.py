from rest_framework import serializers
from .models import Category, Service


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    vehicle_type = serializers.SerializerMethodField()
    category = CategorySerializer()

    class Meta:
        model = Service
        fields = "__all__"

    def get_vehicle_type(self, obj):
        return dict(Service.VEHICLE_TYPE_CHOICES).get(obj.vehicle_type, "")
