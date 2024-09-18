from django import forms
from .models import User


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "fiscal_identification",
            "avatar_url",
            "is_superuser",
            "is_staff",
            "is_active",
            "last_login",
            "date_joined",
            "groups",
            "services",
        ]

    def clean_email(self):
        return self.cleaned_data["email"].lower()
