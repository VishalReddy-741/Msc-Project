from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["name", "project", "assigned_to", "status", "progress_percent", "is_critical", "slack"]
    list_filter = ["status", "is_critical", "project"]
    search_fields = ["name", "project__title", "assigned_to__email"]
    ordering = ["project", "earliest_start"]
