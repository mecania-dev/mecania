from django.urls import path

from . import views

urlpatterns = [
    path("", views.ChatListCreateDeleteView.as_view(), name="create-chat"),
    path("<int:pk>/", views.ChatListCreateDeleteView.as_view(), name="delete-chat"),
    path("lobby/", views.index, name="index"),
    path("<str:room_name>/", views.room, name="room"),
]
