from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer


class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["supervisor", "admin"]


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "supervisor":
            return Project.objects.filter(created_by=user).select_related("created_by")
        if user.role == "admin":
            return Project.objects.all().select_related("created_by")
        return Project.objects.filter(tasks__assigned_to=user).distinct().select_related("created_by")

    def perform_create(self, serializer):
        if self.request.user.role not in ["supervisor", "admin"]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only supervisors can create projects.")
        serializer.save(created_by=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "supervisor":
            return Project.objects.filter(created_by=user)
        if user.role == "admin":
            return Project.objects.all()
        return Project.objects.filter(tasks__assigned_to=user).distinct()

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["supervisor", "admin"]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only supervisors can update projects.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["supervisor", "admin"]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only supervisors can delete projects.")
        return super().destroy(request, *args, **kwargs)
