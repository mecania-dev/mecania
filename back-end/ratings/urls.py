from django.urls import path
from .views import RatingListCreateView

urlpatterns = [
    path("", RatingListCreateView.as_view(), name="ratings-list-create"),
]
