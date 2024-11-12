from django.urls import path
from .views import RatingListCreateView, AIRatingListCreateView

urlpatterns = [
    path("", RatingListCreateView.as_view(), name="ratings-list-create"),
    path("ai/", AIRatingListCreateView.as_view(), name="ai-ratings-list-create"),
]
