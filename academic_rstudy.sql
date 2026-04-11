-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 01:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `academic_rstudy`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_user'),
(22, 'Can change user', 6, 'change_user'),
(23, 'Can delete user', 6, 'delete_user'),
(24, 'Can view user', 6, 'view_user'),
(25, 'Can add project', 7, 'add_project'),
(26, 'Can change project', 7, 'change_project'),
(27, 'Can delete project', 7, 'delete_project'),
(28, 'Can view project', 7, 'view_project'),
(29, 'Can add task', 8, 'add_task'),
(30, 'Can change task', 8, 'change_task'),
(31, 'Can delete task', 8, 'delete_task'),
(32, 'Can view task', 8, 'view_task'),
(33, 'Can add dependency', 9, 'add_dependency'),
(34, 'Can change dependency', 9, 'change_dependency'),
(35, 'Can delete dependency', 9, 'delete_dependency'),
(36, 'Can view dependency', 9, 'view_dependency');

-- --------------------------------------------------------

--
-- Table structure for table `dependencies`
--

CREATE TABLE `dependencies` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `predecessor_id` bigint(20) NOT NULL,
  `successor_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dependencies`
--

INSERT INTO `dependencies` (`id`, `created_at`, `predecessor_id`, `successor_id`) VALUES
(45, '2026-03-22 17:15:00.715670', 41, 42),
(46, '2026-03-22 17:15:00.720575', 42, 43),
(47, '2026-03-22 17:15:00.722649', 42, 44),
(48, '2026-03-22 17:15:00.725304', 43, 45),
(49, '2026-03-22 17:15:00.727301', 44, 46),
(50, '2026-03-22 17:15:00.729712', 45, 47),
(51, '2026-03-22 17:15:00.732623', 46, 47),
(52, '2026-03-22 17:15:00.735664', 47, 48),
(53, '2026-03-22 17:15:00.739829', 47, 49),
(54, '2026-03-22 17:15:00.742663', 48, 49),
(55, '2026-03-22 17:15:00.746262', 49, 50),
(56, '2026-03-22 17:15:00.749050', 46, 50),
(57, '2026-03-22 17:15:00.751585', 50, 51),
(58, '2026-03-22 17:15:00.754802', 51, 52),
(59, '2026-03-22 17:15:00.757956', 52, 53),
(60, '2026-03-22 17:15:00.780625', 54, 55),
(61, '2026-03-22 17:15:00.783132', 55, 56),
(62, '2026-03-22 17:15:00.785699', 56, 57),
(63, '2026-03-22 17:15:00.788054', 55, 58),
(64, '2026-03-22 17:15:00.792013', 57, 59),
(65, '2026-03-22 17:15:00.795029', 58, 59),
(66, '2026-03-22 17:15:00.797686', 59, 60);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(9, 'dependencies', 'dependency'),
(7, 'projects', 'project'),
(5, 'sessions', 'session'),
(8, 'tasks', 'task'),
(6, 'users', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-03-01 17:03:12.239485'),
(2, 'contenttypes', '0002_remove_content_type_name', '2026-03-01 17:03:12.284069'),
(3, 'auth', '0001_initial', '2026-03-01 17:03:12.487149'),
(4, 'auth', '0002_alter_permission_name_max_length', '2026-03-01 17:03:12.539103'),
(5, 'auth', '0003_alter_user_email_max_length', '2026-03-01 17:03:12.549222'),
(6, 'auth', '0004_alter_user_username_opts', '2026-03-01 17:03:12.559975'),
(7, 'auth', '0005_alter_user_last_login_null', '2026-03-01 17:03:12.568987'),
(8, 'auth', '0006_require_contenttypes_0002', '2026-03-01 17:03:12.577451'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2026-03-01 17:03:12.591225'),
(10, 'auth', '0008_alter_user_username_max_length', '2026-03-01 17:03:12.603544'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2026-03-01 17:03:12.616231'),
(12, 'auth', '0010_alter_group_name_max_length', '2026-03-01 17:03:12.634894'),
(13, 'auth', '0011_update_proxy_permissions', '2026-03-01 17:03:12.650541'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2026-03-01 17:03:12.662077'),
(15, 'users', '0001_initial', '2026-03-01 17:03:12.943054'),
(16, 'admin', '0001_initial', '2026-03-01 17:03:13.075438'),
(17, 'admin', '0002_logentry_remove_auto_add', '2026-03-01 17:03:13.104803'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2026-03-01 17:03:13.137204'),
(19, 'tasks', '0001_initial', '2026-03-01 17:03:13.169596'),
(20, 'dependencies', '0001_initial', '2026-03-01 17:03:13.192350'),
(21, 'dependencies', '0002_initial', '2026-03-01 17:03:13.359369'),
(22, 'projects', '0001_initial', '2026-03-01 17:03:13.379614'),
(23, 'projects', '0002_initial', '2026-03-01 17:03:13.455856'),
(24, 'sessions', '0001_initial', '2026-03-01 17:03:13.500513'),
(25, 'tasks', '0002_initial', '2026-03-01 17:03:13.625763');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `start_date` date NOT NULL,
  `deadline` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `start_date`, `deadline`, `status`, `created_at`, `updated_at`, `created_by_id`) VALUES
(5, 'Dependency-Aware Scheduling Research', 'Investigation into CPM-based workflow scheduling for academic research supervision.', '2025-01-06', '2025-06-30', 'active', '2026-03-22 17:15:00.663155', '2026-03-22 17:15:00.663179', 12),
(6, 'Natural Language Processing Thesis', 'MSc thesis on transformer-based NLP for domain-specific text classification.', '2025-02-01', '2025-08-31', 'active', '2026-03-22 17:15:00.667556', '2026-03-22 17:15:00.667570', 13);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `duration_days` int(10) UNSIGNED NOT NULL CHECK (`duration_days` >= 0),
  `status` varchar(20) NOT NULL,
  `progress_percent` int(10) UNSIGNED NOT NULL CHECK (`progress_percent` >= 0),
  `earliest_start` int(10) UNSIGNED DEFAULT NULL CHECK (`earliest_start` >= 0),
  `earliest_finish` int(10) UNSIGNED DEFAULT NULL CHECK (`earliest_finish` >= 0),
  `latest_start` int(10) UNSIGNED DEFAULT NULL CHECK (`latest_start` >= 0),
  `latest_finish` int(10) UNSIGNED DEFAULT NULL CHECK (`latest_finish` >= 0),
  `slack` int(11) DEFAULT NULL,
  `is_critical` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `assigned_to_id` bigint(20) DEFAULT NULL,
  `project_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `description`, `duration_days`, `status`, `progress_percent`, `earliest_start`, `earliest_finish`, `latest_start`, `latest_finish`, `slack`, `is_critical`, `created_at`, `updated_at`, `assigned_to_id`, `project_id`) VALUES
(41, 'Literature Review', '', 14, 'completed', 100, 0, 14, 0, 14, 0, 1, '2026-03-22 17:15:00.670542', '2026-03-22 17:15:00.670573', 14, 5),
(42, 'Research Proposal Draft', '', 7, 'completed', 100, 14, 21, 14, 21, 0, 1, '2026-03-22 17:15:00.674024', '2026-03-22 17:15:00.674048', 14, 5),
(43, 'Data Collection Design', '', 10, 'in_progress', 60, 21, 31, 26, 36, 5, 0, '2026-03-22 17:15:00.676787', '2026-03-22 17:15:00.676810', 15, 5),
(44, 'System Architecture Design', '', 8, 'in_progress', 40, 21, 29, 21, 29, 0, 1, '2026-03-22 17:15:00.683631', '2026-03-22 17:15:00.683751', 14, 5),
(45, 'Database Schema Implementation', '', 5, 'pending', 0, 31, 36, 36, 41, 5, 0, '2026-03-22 17:15:00.686850', '2026-03-22 17:15:00.686869', 15, 5),
(46, 'CPM Algorithm Implementation', '', 12, 'pending', 0, 29, 41, 29, 41, 0, 1, '2026-03-22 17:15:00.689885', '2026-03-22 17:15:00.689942', 14, 5),
(47, 'REST API Development', '', 10, 'pending', 0, 41, 51, 41, 51, 0, 1, '2026-03-22 17:15:00.693128', '2026-03-22 17:15:00.693163', 15, 5),
(48, 'Frontend UI Development', '', 14, 'pending', 0, 51, 65, 51, 65, 0, 1, '2026-03-22 17:15:00.696254', '2026-03-22 17:15:00.696274', 16, 5),
(49, 'Integration Testing', '', 7, 'pending', 0, 65, 72, 65, 72, 0, 1, '2026-03-22 17:15:00.699153', '2026-03-22 17:15:00.699182', 16, 5),
(50, 'Performance Evaluation', '', 5, 'pending', 0, 72, 77, 72, 77, 0, 1, '2026-03-22 17:15:00.702571', '2026-03-22 17:15:00.702595', 14, 5),
(51, 'Thesis Writing', '', 21, 'pending', 0, 77, 98, 77, 98, 0, 1, '2026-03-22 17:15:00.705527', '2026-03-22 17:15:00.705550', 14, 5),
(52, 'Supervisor Review and Revision', '', 7, 'pending', 0, 98, 105, 98, 105, 0, 1, '2026-03-22 17:15:00.708054', '2026-03-22 17:15:00.708091', 14, 5),
(53, 'Final Submission Preparation', '', 3, 'pending', 0, 105, 108, 105, 108, 0, 1, '2026-03-22 17:15:00.711821', '2026-03-22 17:15:00.711856', 14, 5),
(54, 'Dataset Acquisition', '', 7, 'completed', 100, 0, 7, 0, 7, 0, 1, '2026-03-22 17:15:00.761421', '2026-03-22 17:15:00.761451', 15, 6),
(55, 'Data Preprocessing Pipeline', '', 10, 'completed', 100, 7, 17, 7, 17, 0, 1, '2026-03-22 17:15:00.764256', '2026-03-22 17:15:00.764287', 15, 6),
(56, 'Baseline Model Training', '', 14, 'in_progress', 50, 17, 31, 17, 31, 0, 1, '2026-03-22 17:15:00.766976', '2026-03-22 17:15:00.767001', 16, 6),
(57, 'Transformer Fine-tuning', '', 21, 'pending', 0, 31, 52, 31, 52, 0, 1, '2026-03-22 17:15:00.769520', '2026-03-22 17:15:00.769553', 16, 6),
(58, 'Evaluation Metrics Implementation', '', 5, 'pending', 0, 17, 22, 47, 52, 30, 0, '2026-03-22 17:15:00.772015', '2026-03-22 17:15:00.772039', 15, 6),
(59, 'Results Analysis', '', 7, 'pending', 0, 52, 59, 52, 59, 0, 1, '2026-03-22 17:15:00.774676', '2026-03-22 17:15:00.774699', 16, 6),
(60, 'Thesis Writeup', '', 28, 'pending', 0, 59, 87, 59, 87, 0, 1, '2026-03-22 17:15:00.777666', '2026-03-22 17:15:00.777693', 16, 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `last_login`, `is_superuser`, `name`, `email`, `role`, `is_active`, `is_staff`, `created_at`) VALUES
(12, 'pbkdf2_sha256$600000$qkXyAK3LemgV9TIVdZU4cq$96tilAhOq0RIFiTrYp0rKV62gdeSA2DU1LfirWTwAUI=', NULL, 0, 'Supervisor 1', 'supervisor@research.ac.uk', 'supervisor', 1, 0, '2026-03-22 17:14:58.731073'),
(13, 'pbkdf2_sha256$600000$mVvUbQ6zTe03k4ZoUFgtD0$3C5hGMXoIQeN1j/6bBfEJN/rdr+pFD47F/o8JlcrcV4=', NULL, 0, 'Supervisor 2', 'supervisor2@research.ac.uk', 'supervisor', 1, 0, '2026-03-22 17:14:59.100445'),
(14, 'pbkdf2_sha256$600000$1ZGhgliZcSvhEWZ8KKtssT$MG3viMv/zB2GeP1Y55SQPPax/LCNfurgZSRVSqIKbMY=', NULL, 0, 'Student 1', 'student1@research.ac.uk', 'student', 1, 0, '2026-03-22 17:14:59.447389'),
(15, 'pbkdf2_sha256$600000$1LY1geXIlqxIvhJqGevvOq$Jn41eEk4Ov7nx7hgX6Mj8PGn4il5FR6YV3ZAePqTImw=', NULL, 0, 'Student 2', 'student2@research.ac.uk', 'student', 1, 0, '2026-03-22 17:14:59.822901'),
(16, 'pbkdf2_sha256$600000$eP61f25bITgca0gxY289jz$oE8N55cg87D/+sQ4KjXDdcOw8WNHyS0z7yglpEIhsnE=', NULL, 0, 'Student 3', 'student3@research.ac.uk', 'student', 1, 0, '2026-03-22 17:15:00.242307'),
(17, 'pbkdf2_sha256$600000$1m7Y4rjQF4G2HvCEbcF1Jc$PiUe6OWg590WklefJ303FXjtBEptcI4/nURT8yx/8BM=', NULL, 0, 'Platform Admin', 'admin@research.ac.uk', 'admin', 1, 0, '2026-03-22 17:15:00.659127');

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_user_permissions`
--

CREATE TABLE `users_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `dependencies`
--
ALTER TABLE `dependencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dependencies_predecessor_id_successor_id_3c1af069_uniq` (`predecessor_id`,`successor_id`),
  ADD KEY `dependencies_successor_id_836222a0_fk_tasks_id` (`successor_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_created_by_id_7e51a33d_fk_users_id` (`created_by_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_assigned_to_id_942feeaf_fk_users_id` (`assigned_to_id`),
  ADD KEY `tasks_project_id_288f49d9_fk_projects_id` (`project_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_groups_user_id_group_id_fc7788e8_uniq` (`user_id`,`group_id`),
  ADD KEY `users_groups_group_id_2f3517aa_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_user_permissions_user_id_permission_id_3b86cbdf_uniq` (`user_id`,`permission_id`),
  ADD KEY `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` (`permission_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `dependencies`
--
ALTER TABLE `dependencies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `dependencies`
--
ALTER TABLE `dependencies`
  ADD CONSTRAINT `dependencies_predecessor_id_c54b94c1_fk_tasks_id` FOREIGN KEY (`predecessor_id`) REFERENCES `tasks` (`id`),
  ADD CONSTRAINT `dependencies_successor_id_836222a0_fk_tasks_id` FOREIGN KEY (`successor_id`) REFERENCES `tasks` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_created_by_id_7e51a33d_fk_users_id` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_assigned_to_id_942feeaf_fk_users_id` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_project_id_288f49d9_fk_projects_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `users_groups_group_id_2f3517aa_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `users_groups_user_id_f500bee5_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users_user_permissions`
--
ALTER TABLE `users_user_permissions`
  ADD CONSTRAINT `users_user_permissio_permission_id_6d08dcd2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `users_user_permissions_user_id_92473840_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
