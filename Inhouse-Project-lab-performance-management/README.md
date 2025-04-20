# Lab Performance Management System

A comprehensive system for managing lab performance, attendance, and assessments for students and teachers.

## Features

- **User Authentication**: Secure login for students, teachers, and administrators
- **Admin Dashboard**: Manage batches, subjects, teachers, and students
- **Batch Management**: Create and manage lab batches with specific schedules
- **Subject Management**: Add and manage subjects with details
- **Teacher Allocation**: Assign teachers to subjects and batches
- **Attendance Tracking**: Mark and track student attendance
- **Assessment Management**: Record and evaluate student performance
- **Data Import/Export**: Upload student and teacher data via CSV

## Tech Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL Database
- JWT Authentication

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/lab-performance-management.git
cd lab-performance-management
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Configure environment variables
Create a `.env` file in the backend directory with the following variables:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Install frontend dependencies
```
cd ../frontend
npm install
```

5. Start the backend server
```
cd ../backend
npm start
```

6. Start the frontend development server
```
cd ../frontend
npm run dev
```

7. Access the application at `http://localhost:5173`

## Admin Credentials

- Email: admin@lab2025.com
- Password: Admin@123

## License

This project is licensed under the MIT License - see the LICENSE file for details. 