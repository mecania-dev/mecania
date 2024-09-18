from django.contrib import admin

from .models import User
from .forms import UserForm


class Admin(admin.ModelAdmin):
    form = UserForm
    filter_horizontal = (
        "groups",
        "user_permissions",
    )


admin.site.register(User, Admin)
