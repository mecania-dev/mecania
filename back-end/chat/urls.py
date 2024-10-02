from django.urls import path

from . import views

urlpatterns = [
    path("", views.ChatGroupListCreateView.as_view(), name="chat-group-list-create"),
    path("<int:pk>/", views.ChatGroupRetrieveUpdateDestroyView.as_view(), name="chat-group-retrieve-update-destroy"),
    path("<str:room_name>/", views.room, name="room"),
]
