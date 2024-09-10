from django.http import HttpResponse
from .models import KeepAliveMessage

def keep_alive_view(request):
    # Check if the request method is GET
    if request.method == 'GET':
        # Create a new KeepAliveMessage entry if not exists
        KeepAliveMessage.objects.get_or_create(message="Django server is alive.")

        # Fetch the latest KeepAliveMessage entry
        latest_message = KeepAliveMessage.objects.latest('created_at').message

        return HttpResponse(f"Database status: {latest_message}")
    else:
        return HttpResponse(status=405)  # Method Not Allowed
