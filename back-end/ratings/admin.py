from django.contrib import admin
from .models import Rating, AIRating

admin.site.register([Rating, AIRating])
