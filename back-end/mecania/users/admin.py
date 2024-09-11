from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ('groups', 'user_permissions',)

admin.site.register(User, UserAdmin)
