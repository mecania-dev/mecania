from rest_framework import generics, permissions
from users.permissions import IsInGroups
from .models import Rating, AIRating
from .serializers import RatingSerializer, AIRatingSerializer
from utils.mixins import DynamicQuerysetMixin


class RatingListCreateView(DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def get_permissions(self):
        if self.request.method in ["GET"]:
            return [permissions.IsAuthenticated()]
        return [IsInGroups(["Driver"])]

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)


class AIRatingListCreateView(DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = AIRating.objects.all()
    serializer_class = AIRatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
