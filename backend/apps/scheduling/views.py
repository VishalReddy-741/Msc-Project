from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import trigger_schedule_computation, get_schedule_data
from apps.projects.models import Project


class ScheduleComputeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        user = request.user
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.role == "supervisor" and project.created_by != user:
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        trigger_schedule_computation(project_id)
        return Response({"message": "Schedule computed successfully."})


class ScheduleDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        user = request.user
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.role == "supervisor" and project.created_by != user:
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == "student":
            from apps.tasks.models import Task
            if not Task.objects.filter(project_id=project_id, assigned_to=user).exists():
                return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        data = get_schedule_data(project_id)
        if data is None:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        if "error" in data:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        return Response(data)
