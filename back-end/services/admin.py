from django.contrib import admin
from .models import Category, Service

admin.site.register([Category, Service])
