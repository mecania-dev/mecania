from django.db import models
from users.models import User

from utils.geolocation import get_coords_from_address, calculate_distance


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=10)
    district = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    complement = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.CharField(max_length=100, blank=True, null=True)
    longitude = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.street}, {self.number} - {self.district}, {self.city} - {self.state}, {self.zip_code}, {self.country}"

    def set_coords(self):
        print("Setting coords")
        coords = get_coords_from_address(
            f"{self.street}, {self.number} - {self.district}, {self.city} - {self.state}, {self.zip_code}"
        )
        print(f"Coords: {coords}")
        if coords:
            self.latitude = coords[0]
            self.longitude = coords[1]

    def get_distance(self, lat, lon):
        if not self.latitude or not self.longitude:
            self.save()

        return calculate_distance((self.latitude, self.longitude), (lat, lon))

    def save(self, *args, **kwargs):
        self.set_coords()
        super().save(*args, **kwargs)
