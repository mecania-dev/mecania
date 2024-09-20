from django import forms

from .models import User


class UserForm(forms.ModelForm):
    password = forms.CharField(label="Password", widget=forms.PasswordInput, required=False)
    confirm_password = forms.CharField(label="Confirm password", widget=forms.PasswordInput, required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "phone_number",
            "fiscal_identification",
            "avatar_url",
            "is_superuser",
            "is_staff",
            "is_active",
            "last_login",
            "groups",
            "services",
        ]

    def clean_email(self):
        email = self.cleaned_data.get("email")
        email = email.lower()
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = self.cleaned_data.get("password")
        confirm_password = self.cleaned_data.pop("confirm_password")

        if (password or confirm_password) and (password != confirm_password):
            self.add_error("password", "Passwords don't match")
            self.add_error("confirm_password", "Passwords don't match")

        return cleaned_data

    def save(self, commit=True):
        password = self.cleaned_data.get("password")

        # If the user is being created, set the password
        if not self.instance.pk:
            self.instance.set_password(password)
            return super().save(commit)

        old_instance = User.objects.get(pk=self.instance.pk)

        if not password:
            self.instance.password = old_instance.password

        return super().save(commit)
