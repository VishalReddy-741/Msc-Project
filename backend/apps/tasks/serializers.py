from rest_framework import serializers
from .models import Task
from apps.users.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserSerializer(source="assigned_to", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id", "project", "name", "description", "duration_days",
            "assigned_to", "assigned_to_detail", "status", "progress_percent",
            "earliest_start", "earliest_finish", "latest_start", "latest_finish",
            "slack", "is_critical", "created_at", "updated_at",
        ]
        read_only_fields = [
            "id", "earliest_start", "earliest_finish", "latest_start",
            "latest_finish", "slack", "is_critical", "created_at", "updated_at",
        ]


class TaskProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["progress_percent", "status"]

    def validate_progress_percent(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError("Progress must be between 0 and 100.")
        return value
