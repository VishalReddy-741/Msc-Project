import os
import sys
import django
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.models import User
from apps.projects.models import Project
from apps.tasks.models import Task
from apps.dependencies.models import Dependency
from apps.scheduling.services import trigger_schedule_computation


def run():
    print("Clearing existing data...")
    Dependency.objects.all().delete()
    Task.objects.all().delete()
    Project.objects.all().delete()
    User.objects.filter(is_superuser=False).delete()

    print("Creating users...")
    supervisor = User.objects.create_user(
        email="supervisor@research.ac.uk",
        name="Supervisor 1",
        password="sup123456",
        role="supervisor",
    )
    supervisor2 = User.objects.create_user(
        email="supervisor2@research.ac.uk",
        name="Supervisor 2",
        password="sup123456",
        role="supervisor",
    )
    student1 = User.objects.create_user(
        email="student1@research.ac.uk",
        name="Student 1",
        password="stu123456",
        role="student",
    )
    student2 = User.objects.create_user(
        email="student2@research.ac.uk",
        name="Student 2",
        password="stu123456",
        role="student",
    )
    student3 = User.objects.create_user(
        email="student3@research.ac.uk",
        name="Student 3",
        password="stu123456",
        role="student",
    )
    User.objects.create_user(
        email="admin@research.ac.uk",
        name="Platform Admin",
        password="adm123456",
        role="admin",
    )

    print("Creating projects...")
    p1 = Project.objects.create(
        title="Dependency-Aware Scheduling Research",
        description="Investigation into CPM-based workflow scheduling for academic research supervision.",
        start_date=date(2025, 1, 6),
        deadline=date(2025, 6, 30),
        status="active",
        created_by=supervisor,
    )
    p2 = Project.objects.create(
        title="Natural Language Processing Thesis",
        description="MSc thesis on transformer-based NLP for domain-specific text classification.",
        start_date=date(2025, 2, 1),
        deadline=date(2025, 8, 31),
        status="active",
        created_by=supervisor2,
    )

    print("Creating tasks for Project 1...")
    t1 = Task.objects.create(project=p1, name="Literature Review", duration_days=14, assigned_to=student1, status="completed", progress_percent=100)
    t2 = Task.objects.create(project=p1, name="Research Proposal Draft", duration_days=7, assigned_to=student1, status="completed", progress_percent=100)
    t3 = Task.objects.create(project=p1, name="Data Collection Design", duration_days=10, assigned_to=student2, status="in_progress", progress_percent=60)
    t4 = Task.objects.create(project=p1, name="System Architecture Design", duration_days=8, assigned_to=student1, status="in_progress", progress_percent=40)
    t5 = Task.objects.create(project=p1, name="Database Schema Implementation", duration_days=5, assigned_to=student2, status="pending", progress_percent=0)
    t6 = Task.objects.create(project=p1, name="CPM Algorithm Implementation", duration_days=12, assigned_to=student1, status="pending", progress_percent=0)
    t7 = Task.objects.create(project=p1, name="REST API Development", duration_days=10, assigned_to=student2, status="pending", progress_percent=0)
    t8 = Task.objects.create(project=p1, name="Frontend UI Development", duration_days=14, assigned_to=student3, status="pending", progress_percent=0)
    t9 = Task.objects.create(project=p1, name="Integration Testing", duration_days=7, assigned_to=student3, status="pending", progress_percent=0)
    t10 = Task.objects.create(project=p1, name="Performance Evaluation", duration_days=5, assigned_to=student1, status="pending", progress_percent=0)
    t11 = Task.objects.create(project=p1, name="Thesis Writing", duration_days=21, assigned_to=student1, status="pending", progress_percent=0)
    t12 = Task.objects.create(project=p1, name="Supervisor Review and Revision", duration_days=7, assigned_to=student1, status="pending", progress_percent=0)
    t13 = Task.objects.create(project=p1, name="Final Submission Preparation", duration_days=3, assigned_to=student1, status="pending", progress_percent=0)

    print("Creating dependencies for Project 1...")
    Dependency.objects.create(predecessor=t1, successor=t2)
    Dependency.objects.create(predecessor=t2, successor=t3)
    Dependency.objects.create(predecessor=t2, successor=t4)
    Dependency.objects.create(predecessor=t3, successor=t5)
    Dependency.objects.create(predecessor=t4, successor=t6)
    Dependency.objects.create(predecessor=t5, successor=t7)
    Dependency.objects.create(predecessor=t6, successor=t7)
    Dependency.objects.create(predecessor=t7, successor=t8)
    Dependency.objects.create(predecessor=t7, successor=t9)
    Dependency.objects.create(predecessor=t8, successor=t9)
    Dependency.objects.create(predecessor=t9, successor=t10)
    Dependency.objects.create(predecessor=t6, successor=t10)
    Dependency.objects.create(predecessor=t10, successor=t11)
    Dependency.objects.create(predecessor=t11, successor=t12)
    Dependency.objects.create(predecessor=t12, successor=t13)

    print("Creating tasks for Project 2...")
    n1 = Task.objects.create(project=p2, name="Dataset Acquisition", duration_days=7, assigned_to=student2, status="completed", progress_percent=100)
    n2 = Task.objects.create(project=p2, name="Data Preprocessing Pipeline", duration_days=10, assigned_to=student2, status="completed", progress_percent=100)
    n3 = Task.objects.create(project=p2, name="Baseline Model Training", duration_days=14, assigned_to=student3, status="in_progress", progress_percent=50)
    n4 = Task.objects.create(project=p2, name="Transformer Fine-tuning", duration_days=21, assigned_to=student3, status="pending", progress_percent=0)
    n5 = Task.objects.create(project=p2, name="Evaluation Metrics Implementation", duration_days=5, assigned_to=student2, status="pending", progress_percent=0)
    n6 = Task.objects.create(project=p2, name="Results Analysis", duration_days=7, assigned_to=student3, status="pending", progress_percent=0)
    n7 = Task.objects.create(project=p2, name="Thesis Writeup", duration_days=28, assigned_to=student3, status="pending", progress_percent=0)

    print("Creating dependencies for Project 2...")
    Dependency.objects.create(predecessor=n1, successor=n2)
    Dependency.objects.create(predecessor=n2, successor=n3)
    Dependency.objects.create(predecessor=n3, successor=n4)
    Dependency.objects.create(predecessor=n2, successor=n5)
    Dependency.objects.create(predecessor=n4, successor=n6)
    Dependency.objects.create(predecessor=n5, successor=n6)
    Dependency.objects.create(predecessor=n6, successor=n7)

    print("Computing CPM schedules...")
    trigger_schedule_computation(p1.id)
    trigger_schedule_computation(p2.id)

    print("\nSeed data created successfully.")
    print("\nLogin credentials:")
    print(f"  Supervisor 1:  supervisor@research.ac.uk  / sup123456")
    print(f"  Supervisor 2:  supervisor2@research.ac.uk / sup123456")
    print(f"  Student 1:     student1@research.ac.uk    / stu123456")
    print(f"  Student 2:     student2@research.ac.uk    / stu123456")
    print(f"  Student 3:     student3@research.ac.uk    / stu123456")


if __name__ == "__main__":
    run()
