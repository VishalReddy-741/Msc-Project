from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Dependency
from .serializers import DependencySerializer
from apps.scheduling.services import trigger_schedule_computation


class DependencyListCreateView(generics.ListCreateAPIView):
    serializer_class = DependencySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get("project_id")
        qs = Dependency.objects.select_related(
            "predecessor__project", "successor__project"
        )
        if user.role == "supervisor":
            qs = qs.filter(predecessor__project__created_by=user)
        if project_id:
            qs = qs.filter(predecessor__project_id=project_id)
        return qs

    def perform_create(self, serializer):
        if self.request.user.role not in ["supervisor", "admin"]:
            raise PermissionDenied("Only supervisors can define dependencies.")
        dep = serializer.save()
        trigger_schedule_computation(dep.predecessor.project_id)


class DependencyDeleteView(generics.DestroyAPIView):
    serializer_class = DependencySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "supervisor":
            return Dependency.objects.filter(predecessor__project__created_by=user)
        if user.role == "admin":
            return Dependency.objects.all()
        return Dependency.objects.none()

    def perform_destroy(self, instance):
        if self.request.user.role not in ["supervisor", "admin"]:
            raise PermissionDenied("Only supervisors can remove dependencies.")
        project_id = instance.predecessor.project_id
        instance.delete()
        trigger_schedule_computation(project_id)
