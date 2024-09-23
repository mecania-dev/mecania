# Generated by Django 5.0.4 on 2024-09-23 02:40

import django.core.validators
import users.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="avatar_url",
            field=models.ImageField(
                blank=True, null=True, upload_to=users.models.avatar_url_path
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="first_name",
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="fiscal_identification",
            field=models.CharField(
                blank=True,
                max_length=18,
                null=True,
                unique=True,
                validators=[django.core.validators.MinLengthValidator(14)],
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="last_name",
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=models.CharField(
                blank=True,
                max_length=25,
                null=True,
                validators=[django.core.validators.MinLengthValidator(14)],
            ),
        ),
    ]
