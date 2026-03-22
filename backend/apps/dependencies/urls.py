from django.urls import path
from .views import DependencyListCreateView, DependencyDeleteView

urlpatterns = [
    path("", DependencyListCreateView.as_view(), name="dependency_list_create"),
    path("<int:pk>/", DependencyDeleteView.as_view(), name="dependency_delete"),
]
