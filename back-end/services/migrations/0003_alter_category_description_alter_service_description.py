# Generated by Django 5.0.4 on 2024-09-25 00:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0002_category_alter_service_description_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="category",
            name="description",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="service",
            name="description",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
