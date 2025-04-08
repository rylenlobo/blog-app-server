# Blog Application Server

This repository contains the server-side code for a blog application.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blog-application/server
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Environment Configuration:
   Create a `.env` file in the server directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog-app
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Scripts

- `npm run start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm run test` - Run tests

## Technologies Used

- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
