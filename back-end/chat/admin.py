from django.contrib import admin
from .models import *

admin.site.register([ChatGroup, GroupMessage, Issue, Recommendation, RequestGroup, RequestGroupMessage])
