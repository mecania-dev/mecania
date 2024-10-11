from django.contrib import admin

from .models import User
from .forms import UserForm


class UserAdmin(admin.ModelAdmin):
    form = UserForm
    filter_horizontal = ("groups", "user_permissions", "services")


admin.site.register(User, UserAdmin)
