from django import forms
from .models import User


class UserForm(forms.ModelForm):
    password = forms.CharField(required=False, widget=forms.PasswordInput)
    confirm_password = forms.CharField(required=False, widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = [
            "password",
            "confirm_password",
            "username",
            "first_name",
            "last_name",
            "email",
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

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)  # Extract request object
        super().__init__(*args, **kwargs)

        self.fields["date_joined"].required = False

    def clean_email(self):
        return self.cleaned_data["email"].lower()

    def clean(self):
        cleaned_data = super().clean()

        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            self.add_error("password", "Passwords do not match.")
            self.add_error("confirm_password", "Passwords do not match.")

        if self.request:
            if self.request.method == "POST":
                # Password validation
                if not password:
                    self.add_error("password", "This field is required.")
                if not confirm_password:
                    self.add_error("confirm_password", "This field is required.")

            if self.request.method != "PATCH":
                # Group validation
                group_names = [group.name for group in cleaned_data.get("groups", [])]
                if "Mechanic" in group_names:
                    fiscal_identification = cleaned_data.get("fiscal_identification")
                    phone_number = cleaned_data.get("phone_number")

                    if not fiscal_identification:
                        self.add_error("fiscal_identification", "This field is required for mechanics.")
                    if not phone_number:
                        self.add_error("phone_number", "This field is required for mechanics.")

        return cleaned_data
