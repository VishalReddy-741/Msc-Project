from rest_framework import serializers
from .models import Project
from apps.users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    created_by_detail = UserSerializer(source="created_by", read_only=True)
    task_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "title", "description", "start_date", "deadline",
            "status", "created_by", "created_by_detail", "created_at",
            "updated_at", "task_count", "progress",
        ]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_progress(self, obj):
        tasks = obj.tasks.all()
        if not tasks.exists():
            return 0
        total = sum(t.progress_percent for t in tasks)
        return round(total / tasks.count(), 1)
