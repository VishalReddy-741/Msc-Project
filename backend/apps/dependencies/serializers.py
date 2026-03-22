from rest_framework import serializers
from .models import Dependency
from apps.tasks.serializers import TaskSerializer


class DependencySerializer(serializers.ModelSerializer):
    predecessor_detail = TaskSerializer(source="predecessor", read_only=True)
    successor_detail = TaskSerializer(source="successor", read_only=True)

    class Meta:
        model = Dependency
        fields = [
            "id", "predecessor", "successor",
            "predecessor_detail", "successor_detail", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        predecessor = data.get("predecessor")
        successor = data.get("successor")

        if predecessor == successor:
            raise serializers.ValidationError("A task cannot depend on itself.")

        if predecessor.project_id != successor.project_id:
            raise serializers.ValidationError("Tasks must belong to the same project.")

        if Dependency.objects.filter(predecessor=predecessor, successor=successor).exists():
            raise serializers.ValidationError("This dependency already exists.")

        from apps.tasks.models import Task
        from apps.dependencies.models import Dependency as Dep

        tasks_qs = list(predecessor.project.tasks.values("id", "duration_days"))
        existing_deps = list(Dep.objects.filter(
            predecessor__project=predecessor.project
        ).values("predecessor_id", "successor_id"))
        existing_deps_plain = [{"predecessor_id": d["predecessor_id"], "successor_id": d["successor_id"]} for d in existing_deps]

        from apps.scheduling.cpm_engine import CPMEngine
        is_valid = CPMEngine.validate_no_circular_dependency(
            tasks_qs,
            existing_deps_plain,
            new_predecessor_id=predecessor.id,
            new_successor_id=successor.id,
        )

        if not is_valid:
            raise serializers.ValidationError("Adding this dependency would create a circular dependency.")

        return data
