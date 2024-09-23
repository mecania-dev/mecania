from django.db import models


class NullableCharField(models.CharField):
    def __init__(self, *args, **kwargs):
        # Set default attributes
        kwargs.setdefault("blank", True)
        kwargs.setdefault("null", True)
        super().__init__(*args, **kwargs)

    def pre_save(self, model_instance, add):
        value = super().pre_save(model_instance, add)
        # Convert empty string to None
        return value if value != "" else None
