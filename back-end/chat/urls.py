from django.urls import path

from . import views

urlpatterns = [
    path("", views.ChatGroupListCreateView.as_view(), name="chat-group-list-create"),
    path("<int:pk>/", views.ChatGroupRetrieveUpdateDestroyView.as_view(), name="chat-group-retrieve-update-destroy"),
    path("requests/", views.RequestGroupView.as_view(), name="request-group-list-create"),
    path("requests/<int:pk>/", views.RequestGroupView.as_view(), name="request-group-retrieve-update-destroy"),
    path("<int:chat_group_id>/summary/", views.ChatSummaryView.as_view(), name="chat-summary"),
]
