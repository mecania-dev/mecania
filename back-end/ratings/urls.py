from django.urls import path
from .views import (
    RatingListCreateView,
    RatingRetrieveUpdateDestroy,
    AIRatingListCreateView,
    AIRatingRetrieveUpdateDestroy,
)

urlpatterns = [
    path("", RatingListCreateView.as_view(), name="rating-list-create"),
    path("<int:pk>/", RatingRetrieveUpdateDestroy.as_view(), name="rating-retrieve-update-destroy"),
    path("ai/", AIRatingListCreateView.as_view(), name="ai-rating-list-create"),
    path("ai/<int:pk>/", AIRatingRetrieveUpdateDestroy.as_view(), name="ai-rating-retrieve-update-destroy"),
]
