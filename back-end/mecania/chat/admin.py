from django.contrib import admin
from .models import Chat, Message, Issue, Recommendation

admin.site.register([Chat, Message, Issue, Recommendation])
