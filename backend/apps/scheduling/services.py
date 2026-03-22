from datetime import timedelta
from apps.tasks.models import Task
from apps.dependencies.models import Dependency
from .cpm_engine import CPMEngine


def trigger_schedule_computation(project_id):
    tasks = list(Task.objects.filter(project_id=project_id).values("id", "duration_days"))
    dependencies = list(
        Dependency.objects.filter(predecessor__project_id=project_id).values("predecessor_id", "successor_id")
    )

    if not tasks:
        return

    engine = CPMEngine(tasks, dependencies)
    result = engine.compute()

    if result.get("error"):
        return

    for task_data in result["tasks"]:
        Task.objects.filter(id=task_data["id"]).update(
            earliest_start=task_data["earliest_start"],
            earliest_finish=task_data["earliest_finish"],
            latest_start=task_data["latest_start"],
            latest_finish=task_data["latest_finish"],
            slack=task_data["slack"],
            is_critical=task_data["is_critical"],
        )


def get_schedule_data(project_id):
    from apps.projects.models import Project
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return None

    tasks = list(Task.objects.filter(project_id=project_id).values("id", "duration_days"))
    dependencies = list(
        Dependency.objects.filter(predecessor__project_id=project_id).values("predecessor_id", "successor_id")
    )

    engine = CPMEngine(tasks, dependencies)
    result = engine.compute()

    if result.get("error"):
        return {"error": result["error"]}

    project_duration = result["project_duration"]
    predicted_end = project.start_date + timedelta(days=project_duration)

    from apps.tasks.models import Task as TaskModel
    from apps.tasks.serializers import TaskSerializer
    all_tasks = TaskModel.objects.filter(project_id=project_id).select_related("assigned_to")

    from apps.dependencies.serializers import DependencySerializer
    all_deps = Dependency.objects.filter(predecessor__project_id=project_id).select_related(
        "predecessor", "successor"
    )

    return {
        "project_id": project_id,
        "project_title": project.title,
        "start_date": str(project.start_date),
        "deadline": str(project.deadline),
        "predicted_end_date": str(predicted_end),
        "project_duration_days": project_duration,
        "on_schedule": predicted_end <= project.deadline,
        "tasks": TaskSerializer(all_tasks, many=True).data,
        "dependencies": [{"id": d.id, "predecessor": d.predecessor_id, "successor": d.successor_id} for d in all_deps],
        "critical_task_count": sum(1 for t in all_tasks if t.is_critical),
        "total_task_count": all_tasks.count(),
        "slack_summary": {
            "zero_slack": sum(1 for t in all_tasks if t.slack == 0),
            "low_slack": sum(1 for t in all_tasks if t.slack is not None and 0 < t.slack <= 3),
            "high_slack": sum(1 for t in all_tasks if t.slack is not None and t.slack > 3),
        },
    }
