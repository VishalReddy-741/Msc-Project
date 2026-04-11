import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import SupervisorDashboard from "./pages/Supervisor/SupervisorDashboard";
import ProjectListPage from "./pages/Supervisor/ProjectListPage";
import ProjectDetailPage from "./pages/Supervisor/ProjectDetailPage";
import TaskManagerPage from "./pages/Supervisor/TaskManagerPage";
import DependencyManagerPage from "./pages/Supervisor/DependencyManagerPage";
import ScheduleViewPage from "./pages/Supervisor/ScheduleViewPage";

import StudentDashboard from "./pages/Student/StudentDashboard";
import MyTasksPage from "./pages/Student/MyTasksPage";
import TaskDetailPage from "./pages/Student/TaskDetailPage";

import ProfilePage from "./pages/Profile/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminProjectsPage from "./pages/Admin/AdminProjectsPage";

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<Layout />}>

      <Route
        path="/supervisor/dashboard"
        element={<ProtectedRoute roles={["supervisor"]}><SupervisorDashboard /></ProtectedRoute>}
      />
      <Route
        path="/supervisor/projects"
        element={<ProtectedRoute roles={["supervisor"]}><ProjectListPage /></ProtectedRoute>}
      />
      <Route
        path="/supervisor/projects/:id"
        element={<ProtectedRoute roles={["supervisor"]}><ProjectDetailPage /></ProtectedRoute>}
      />
      <Route
        path="/supervisor/tasks"
        element={<ProtectedRoute roles={["supervisor"]}><TaskManagerPage /></ProtectedRoute>}
      />
      <Route
        path="/supervisor/dependencies"
        element={<ProtectedRoute roles={["supervisor"]}><DependencyManagerPage /></ProtectedRoute>}
      />
      <Route
        path="/supervisor/schedule"
        element={<ProtectedRoute roles={["supervisor"]}><ScheduleViewPage /></ProtectedRoute>}
      />

      <Route
        path="/student/dashboard"
        element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/student/tasks"
        element={<ProtectedRoute roles={["student"]}><MyTasksPage /></ProtectedRoute>}
      />
      <Route
        path="/student/tasks/:id"
        element={<ProtectedRoute roles={["student"]}><TaskDetailPage /></ProtectedRoute>}
      />

      <Route
        path="/profile"
        element={<ProtectedRoute roles={["supervisor", "student", "admin"]}><ProfilePage /></ProtectedRoute>}
      />

      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin/users"
        element={<ProtectedRoute roles={["admin"]}><AdminUsersPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/projects"
        element={<ProtectedRoute roles={["admin"]}><AdminProjectsPage /></ProtectedRoute>}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
