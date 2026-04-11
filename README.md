# ResearchFlow

Research Workflow Scheduling Engine built with React and Django REST Framework. Uses Critical Path Method (CPM) to compute task schedules, identify critical paths and calculate float for academic research projects.

## Prerequisites

Make sure the following are installed on your machine before proceeding.

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18 or higher | https://nodejs.org |
| Python | 3.10 or higher | https://www.python.org/downloads |
| MariaDB | 10.4 or higher | https://mariadb.org/download |
| pip | Comes with Python | - |

## Project Structure

```
PRS_ReactJs/
  backend/            Django REST API
    apps/
      users/           User authentication and management
      projects/        Research project CRUD
      tasks/           Task CRUD and progress tracking
      dependencies/    Task dependency management
      scheduling/      CPM engine and schedule computation
    config/            Django settings, URLs, WSGI
    seed_data.py       Sample data seeder
  src/                 React frontend
    components/        Shared layout and route components
    context/           Auth context provider
    pages/             All page components
    services/          Axios API service
  package.json         Frontend dependencies
  vite.config.js       Vite configuration
```

## Setup Instructions

### Step 1: Create the Database

Open a terminal and log into MariaDB:

```
mysql -u root -p
```

Run the following SQL command to create the database:

```sql
CREATE DATABASE academic_rstudy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Type `exit` to leave the MariaDB prompt.

### Step 2: Configure Environment Variables

Navigate to the `backend` folder. There is a file called `.env`. Open it and update the database credentials if yours differ from the defaults:

```
SECRET_KEY=django-insecure-change-this-in-production-abc123xyz
DEBUG=True
DB_NAME=academic_rstudy
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1
```

If your MariaDB root user has a password, add it to `DB_PASSWORD`.

### Step 3: Install Backend Dependencies

Open a terminal in the project root folder:

```
cd backend
pip install -r requirements.txt
```

### Step 4: Run Database Migrations

This creates all the required tables in the database:

```
python manage.py migrate
```

### Step 5: Seed Sample Data

This populates the database with sample users, projects, tasks, dependencies and computes the CPM schedule:

```
python seed_data.py
```

### Step 6: Start the Backend Server

```
python manage.py runserver 8000
```

Keep this terminal open. The API will be available at `http://localhost:8000`.

### Step 7: Install Frontend Dependencies

Open a new terminal in the project root folder:

```
npm install
```

### Step 8: Start the Frontend Server

```
npm run dev
```

The application will be available at `http://localhost:5173`.

## Demo Accounts

After running the seed script, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@research.ac.uk | adm123456 |
| Supervisor | supervisor@research.ac.uk | sup123456 |
| Student | student1@research.ac.uk | stu123456 |
| Student | student2@research.ac.uk | stu123456 |

## Features

### Public Pages
- Platform overview with CPM demonstration
- Approach page explaining the scheduling methodology
- Support contact form

### Supervisor
- Create and manage research projects
- Create tasks with duration, assign to students
- Define task dependencies (precedence relationships)
- View CPM computed schedule with critical path highlighting
- Gantt style visual schedule with earliest/latest start and finish times

### Student
- View assigned tasks and CPM schedule data
- Update task progress and status
- View critical path information and float values

### Admin
- Platform wide user management (create, edit, delete users)
- View all projects across all supervisors
- Platform statistics and analytics dashboard

## Technology Stack

- **Frontend**: React 18, React Router 6, Recharts, Axios, Vite
- **Backend**: Django 4.2, Django REST Framework, Simple JWT
- **Database**: MariaDB 10.4
- **Scheduling**: Custom CPM engine (forward pass, backward pass, float calculation)

## Troubleshooting

### Backend fails to start
- Check that MariaDB is running
- Verify the database `academic_rstudy` exists
- Check `.env` credentials match your MariaDB setup

### Frontend shows network errors
- Make sure the backend is running on port 8000
- Check that both terminals are open (one for backend, one for frontend)

### Migration errors
- Make sure you created the database first (Step 1)
- Run `python manage.py migrate` before running `seed_data.py`
