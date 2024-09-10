from django.urls import path, include

from .views import keep_alive_view

urlpatterns = [
    path('keep-alive/', keep_alive_view, name='keep_alive'),
    path('auth/', include('authentication.urls')),
    path('users/', include('users.urls')),
    path('services/', include('services.urls')),
    path('chat/', include('chat.urls')),
]
