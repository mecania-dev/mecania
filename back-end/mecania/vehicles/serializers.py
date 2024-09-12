from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    transmission = serializers.SerializerMethodField()
    fuel_type = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "brand",
            "model",
            "year",
            "mileage",
            "transmission",
            "fuel_type",
            "cylinder_count",
            "license_plate",
            "chassis_number",
            "created_at",
            "updated_at",
        ]

    def get_transmission(self, obj):
        return dict(Vehicle.TRANSMISSION_CHOICES).get(obj.transmission, "")

    def get_fuel_type(self, obj):
        return dict(Vehicle.FUEL_CHOICES).get(obj.fuel_type, "")


class VehicleCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "brand",
            "model",
            "year",
            "mileage",
            "transmission",
            "fuel_type",
            "cylinder_count",
            "license_plate",
            "chassis_number",
        ]
