from django.db import models


class LogEntry(models.Model):
    LOG_LEVELS = (
        ("DEBUG", "Debug"),
        ("INFO", "Info"),
        ("WARNING", "Warning"),
        ("ERROR", "Error"),
        ("CRITICAL", "Critical"),
    )

    log_level = models.CharField(max_length=10, choices=LOG_LEVELS)
    message = models.TextField()
    context = models.CharField(max_length=255, null=True, blank=True)
    request_data = models.TextField(null=True, blank=True)
    response_data = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.log_level}: {self.message[:50]}"
