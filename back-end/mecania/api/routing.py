from django.urls import path, include

websocket_urlpatterns = [
    path('ws/chat/', include('chat.routing')),
]
