# Syto: Lessons for Every Child

Syto is a learning platform designed to provide interactive lessons for children. It connects instructors with students, offering a wide variety of courses in a fun and engaging way. Built using the MERN stack (MongoDB, Express, React, and Node.js), this project aims to create a scalable, secure, and user-friendly platform.

## Table of Contents

- Features
- Technology Stack
- Project Structure
- Installation
- Running the Application
- API Documentation
- Future Improvements

## Features

- User authentication (register, login, logout, password recovery)
- User roles (student, instructor)
- Secure payments via Stripe
- Interactive course management for instructors (create, update, view courses)
- Student enrollment and course progress tracking
- Lesson previews with media content
- Email notifications for important actions (course updates, payment success)
- Responsive design for mobile, tablet, and desktop

## Project Structure

.
├── client # Client-side code (React.js + Next.js)
│ ├── components # UI Components (Forms, Cards, Navs, Modals, Routes)
│ ├── context # Global state management with React context
│ ├── pages # Next.js pages for different routes
│ ├── public # Public assets (CSS, images)
│ ├── utils # Helper functions for the client
├── server # Server-side code (Node.js + Express)
│ ├── controllers # Request handling logic
│ ├── middlewares # Custom middleware (auth, error handling)
│ ├── models # MongoDB models (User, Course)
│ ├── routes # API routes for different entities (auth, courses, instructors)
│ ├── utils # Utility functions for authentication, etc.
└── README.md # Project documentation

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- MongoDB
- Stripe Account (for payment processing)

### Backend Setup

1. Clone the repository:
   `git clone https://github.com/Frank23523/Syto.git>`
   `cd syto/server`

2. Install the backend dependencies:
   npm install

3. Create a .env file and add your environment variables:

# .env

DATABASE=mongodb://localhost:27017/syto
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret_key

4. Start the MongoDB server:
   sudo service mongod start

5. Start the backend:
   npm start

Frontend Setup

1. Navigate to the client directory:
   cd ../client

2. Install the frontend dependencies:
   npm install

3. Create a .env.local file for the client with necessary environment variables:

# .env.local

NEXT_PUBLIC_API=http://localhost:8000/api

4. Start the frontend:
   npm run dev

Running the Application

After setting up both the backend and frontend, visit http://localhost:3000 to access the application.

- Login with your user credentials or register as a new user.
- Instructors can create and manage courses from their dashboard.
- Students can enroll in courses and track progress.

API Documentation

The backend provides a RESTful API for managing users, courses, and payments. Below is a summary of the main endpoints:

- User Authentication:

* POST /api/register: Register a new user
* POST /api/login: Log in a user
* POST /api/forgot-password: Recover password

- Course Management:

* GET /api/courses: Get all available courses
* POST /api/course: Create a new course (instructors only)
* PUT /api/course/:slug: Update course details (instructors only)
* GET /api/course/:slug: Get a single course by its slug
* POST /api/course/lesson: Add a lesson to a course

- Payments:

* POST /api/stripe/payment: Process a payment using Stripe

Future Improvements

- Integrate real-time communication features (e.g., chat between students and instructors)
- Add gamification elements (e.g., badges, leaderboards)
- Improve accessibility with enhanced ARIA roles and support for screen readers
- Implement caching using Redis for improved performance
