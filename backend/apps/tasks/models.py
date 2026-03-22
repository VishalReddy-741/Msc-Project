from django.db import models
from apps.projects.models import Project
from apps.users.models import User


class Task(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("blocked", "Blocked"),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_days = models.PositiveIntegerField(default=1)
    assigned_to = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_tasks"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    progress_percent = models.PositiveIntegerField(default=0)
    earliest_start = models.PositiveIntegerField(null=True, blank=True)
    earliest_finish = models.PositiveIntegerField(null=True, blank=True)
    latest_start = models.PositiveIntegerField(null=True, blank=True)
    latest_finish = models.PositiveIntegerField(null=True, blank=True)
    slack = models.IntegerField(null=True, blank=True)
    is_critical = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tasks"
        ordering = ["earliest_start", "name"]

    def __str__(self):
        return f"{self.project.title} - {self.name}"
