from django.db import models

class Service(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('Car', 'Carro'),
        ('Motorcycle', 'Moto')
    ]

    CATEGORIES_CHOICES = [
        ('Controls', 'Controles'),
        ('Harness', 'Fiação'),
        ('PTO', 'PTO (Tomada de Força)'),
        ('Maintenance', 'Manutenção'),
        ('Rotation', 'Rotação'),
        ('Outrigger', 'Estabilizador'),
        ('Body', 'Carroceria'),
        ('Electronics', 'Eletrônicos'),
        ('Resale', 'Revenda'),
        ('Hydraulics', 'Hidráulica'),
        ('Boom', 'Braço'),
        ('Test', 'Teste'),
        ('Auger', 'Sonda'),
        ('Digger', 'Escavadeira'),
        ('Chassis', 'Chassi'),
        ('Vague', 'Vago')
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORIES_CHOICES)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES, default='CAR')
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.name
