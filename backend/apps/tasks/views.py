from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer, TaskProgressSerializer
from apps.scheduling.services import trigger_schedule_computation


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get("project_id")
        qs = Task.objects.select_related("project", "assigned_to")

        if user.role == "supervisor":
            qs = qs.filter(project__created_by=user)
        elif user.role == "student":
            qs = qs.filter(assigned_to=user)
        
        if project_id:
            qs = qs.filter(project_id=project_id)
        
        return qs

    def perform_create(self, serializer):
        if self.request.user.role not in ["supervisor", "admin"]:
            raise PermissionDenied("Only supervisors can create tasks.")
        task = serializer.save()
        trigger_schedule_computation(task.project_id)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "supervisor":
            return Task.objects.filter(project__created_by=user).select_related("project", "assigned_to")
        if user.role == "admin":
            return Task.objects.all().select_related("project", "assigned_to")
        return Task.objects.filter(assigned_to=user).select_related("project", "assigned_to")

    def perform_update(self, serializer):
        task = self.get_object()
        user = self.request.user
        if user.role == "student" and user != task.assigned_to:
            raise PermissionDenied("You can only update your own tasks.")
        updated = serializer.save()
        trigger_schedule_computation(updated.project_id)

    def perform_destroy(self, instance):
        if self.request.user.role not in ["supervisor", "admin"]:
            raise PermissionDenied("Only supervisors can delete tasks.")
        project_id = instance.project_id
        instance.delete()
        trigger_schedule_computation(project_id)


class TaskProgressUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role == "student" and user != task.assigned_to:
            raise PermissionDenied("You can only update your own task progress.")

        serializer = TaskProgressSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        trigger_schedule_computation(updated.project_id)
        return Response(TaskSerializer(updated).data)
