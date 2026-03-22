from django.contrib import admin
from .models import Dependency


@admin.register(Dependency)
class DependencyAdmin(admin.ModelAdmin):
    list_display = ["predecessor", "successor", "created_at"]
    search_fields = ["predecessor__name", "successor__name"]
