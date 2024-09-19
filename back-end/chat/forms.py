from django import forms
from .models import GroupMessage


class GroupMessageCreateForm(forms.ModelForm):
    class Meta:
        model = GroupMessage
        fields = ["content"]
        widgets = {
            "content": forms.TextInput(
                attrs={"placeholder": "Type your message here...", "maxlength": 300, "autofocus": True}
            ),
        }
