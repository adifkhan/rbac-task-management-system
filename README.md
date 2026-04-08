# TaskFlow - Task Management System

A full-stack task management system with role-based access control and comprehensive audit logging.

## Features

### Admin Capabilities

- ✅ Create, update, and delete tasks
- ✅ Assign tasks to users
- ✅ View all system tasks
- ✅ View complete audit logs

### User Capabilities

- ✅ View assigned tasks only
- ✅ Update task status (PENDING → PROCESSING → DONE)

### Audit Logging

All critical actions are automatically logged:

- Task creation, updates, and deletion
- Status changes
- Assignment changes
- Before/after state tracking

## Demo Credentials

**Admin User:**

- Email: `admin@example.com`
- Password: `password123`

**Regular User:**

- Email: `user@example.com`
- Password: `password123`

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Ports 3000, 3001, 5432 available

### Run the Application

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-system

# Start all services
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:3001/api
```
