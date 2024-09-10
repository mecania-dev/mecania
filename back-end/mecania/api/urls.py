from django.urls import path, include

urlpatterns = [
    path('auth/', include('authentication.urls')),
    path('users/', include('users.urls')),
    path('services/', include('services.urls')),
    path('chat/', include('chat.urls')),
]
