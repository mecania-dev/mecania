from django.urls import path

from . import views

urlpatterns = [
    path("", views.ChatListCreateDeleteView.as_view(), name="create-chat"),
    path("<int:pk>/", views.ChatListCreateDeleteView.as_view(), name="delete-chat"),
]
