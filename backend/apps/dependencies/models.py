from django.db import models
from apps.tasks.models import Task


class Dependency(models.Model):
    predecessor = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="successor_links")
    successor = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="predecessor_links")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dependencies"
        unique_together = [["predecessor", "successor"]]
        ordering = ["predecessor"]

    def __str__(self):
        return f"{self.predecessor.name} → {self.successor.name}"
