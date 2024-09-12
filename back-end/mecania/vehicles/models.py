from django.db import models
from users.models import User


class Vehicle(models.Model):
    FUEL_CHOICES = [
        ("gasoline", "Gasolina"),
        ("diesel", "Diesel"),
        ("ethanol", "Etanol"),
        ("electric", "Elétrico"),
        ("hybrid", "Híbrido"),
    ]
    TRANSMISSION_CHOICES = [("manual", "Manual"), ("automatic", "Automático")]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vehicles")
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    mileage = models.IntegerField()
    transmission = models.CharField(max_length=50, choices=TRANSMISSION_CHOICES, blank=True, null=True)
    fuel_type = models.CharField(max_length=100, choices=FUEL_CHOICES, blank=True, null=True)
    cylinder_count = models.IntegerField(blank=True, null=True)
    license_plate = models.CharField(max_length=10)
    chassis_number = models.CharField(max_length=17)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.brand} {self.model} {self.year}"
