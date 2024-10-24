# Syto: Where kids meet tutors, and learning goes viral!

Syto is a learning platform designed to provide interactive lessons for children. It connects instructors with students, offering a wide variety of courses in a fun and engaging way. Built using the MERN stack (MongoDB, Express, React, and Node.js), this project aims to create a scalable, secure, and user-friendly platform.

## Architecture & Technologies

The Syto platform is built with the MERN stack:

- Frontend: React, Next.js
- Backend: Node.js, Express
- Database: MongoDB
- Payment Integration: Stripe (in testing phase, with plans to switch to Paystack)

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- MongoDB
- Stripe Account (for payment processing)

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Frank23523/Syto.git
cd Syto/server
```

2. Install the backend dependencies:

```bash
npm install
```

3. Create a .env file and add your environment variables:

```bash
DATABASE=mongodb://localhost:27017/Syto
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret_key
```

4. Start the MongoDB server:

```bash
sudo service mongod start
```

5. Start the backend:

```bash
npm start
```

### Frontend Setup

1. Navigate to the client directory:

```bash
cd ../client
```

2. Install the frontend dependencies:

```bash
npm install
```

3. Create a .env.local file for the client with necessary environment variables:

```bash
NEXT_PUBLIC_API=http://localhost:8000/api
```

5. Start the frontend:

```bash
npm run dev
```

## Running the Application

After setting up both the backend and frontend,
visit http://localhost:3000 to access the application.

- Login with your user credentials or register as a new user
- Instructors can create and manage courses from their dashboard.
- Students can enroll in courses and track progress.
- API Documentation
- The backend provides a RESTful API for managing users, courses, and payments. Below is a summary of the main endpoints:

## Features

- User authentication (register, login, logout, password recovery)
- User roles (student, instructor)
- Secure payments via Stripe
- Interactive course management for instructors (create, update, view courses)
- Student enrollment and course progress tracking
- Lesson previews with media content
- Email notifications for important actions (course updates, payment success)

## Future Improvements

- Integrate real-time communication features (e.g., chat between students and instructors)
- Add gamification elements (e.g., badges, leaderboards)
- Implement caching using Redis for improved performance

## Team

We are a two-member team:

Frank Anin
Daniel Quist

Together, we’ve developed Syto, a platform where instructors can create and upload courses, and students can easily access them.
