from django.urls import path
from .views import TaskListCreateView, TaskDetailView, TaskProgressUpdateView

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task_list_create"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task_detail"),
    path("<int:pk>/progress/", TaskProgressUpdateView.as_view(), name="task_progress"),
]
