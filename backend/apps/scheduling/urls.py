from django.urls import path
from .views import ScheduleComputeView, ScheduleDetailView

urlpatterns = [
    path("<int:project_id>/", ScheduleDetailView.as_view(), name="schedule_detail"),
    path("<int:project_id>/compute/", ScheduleComputeView.as_view(), name="schedule_compute"),
]
