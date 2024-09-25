from rest_framework import generics, permissions
from users.permissions import IsInGroups
from .models import Rating
from .serializers import RatingSerializer
from utils.mixins import FiltersMixin

# REMOVE PAGINATION_CLASS = NONE WHEN FRONT END IS READY


class RatingListCreateView(FiltersMixin, generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method in ["GET"]:
            return [permissions.IsAuthenticated()]
        return [IsInGroups(["Driver"])]

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)
