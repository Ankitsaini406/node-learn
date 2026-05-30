# Blogging Platform API

A professional RESTful Blogging Platform API built with **Node.js**, **Express.js**, **MongoDB**, and **Redis caching**.

This project is part of my Node.js learning journey, where I explore backend development concepts such as API design, database management, caching, error handling, and scalable project architecture.

---

## Project Links

### GitHub Repository

Repository:
https://github.com/Ankitsaini406/node-learn/tree/main/01-blogging-api

### Roadmap.sh Project

Project Reference:
https://roadmap.sh/projects/blogging-platform-api

---

# Features

* Create blog posts
* Get all blogs
* Get single blog by ID
* Update blog
* Delete blog
* Search blogs by title, content, category, and tags
* Automatic slug generation
* Redis caching
* Centralized error handling
* MongoDB integration with Mongoose
* RESTful API architecture
* Environment variable support
* Graceful server shutdown
* Modular folder structure

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* dotenv
* slugify
* Nodemon

---

# Project Structure

```bash
src/
│
├── config/
│   └── config.js
│
├── controller/
│   └── blog.controller.js
│
├── middleware/
│   └── error.middleware.js
│
├── models/
│   └── blog.model.js
│
├── routes/
│   └── blog.routes.js
│
├── utils/
│   └── utils.js
│
├── app.js
└── index.js
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Ankitsaini406/node-learn.git
```

Move into the project directory:

```bash
cd node-learn/01-blogging-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DATABASE_URL=your_mongodb_connection_string

NODE_ENV=development
```

---

# Run Development Server

```bash
npm run dev
```

Server:

```bash
http://localhost:5000
```

---

# API Endpoints

## Create Blog

```http
POST /api/blog
```

### Request Body

```json
{
  "title": "Learn Node.js",
  "content": "Node.js is a JavaScript runtime...",
  "category": "Backend",
  "tags": ["node", "express"]
}
```

---

## Get All Blogs

```http
GET /api/blog
```

---

## Get Single Blog

```http
GET /api/blog/:id
```

Example:

```http
GET /api/blog/685f123456789abcdef12345
```

---

## Update Blog

```http
PUT /api/blog/:id
```

Example:

```json
{
  "title": "Updated Blog Title"
}
```

Only the provided fields are updated.

---

## Delete Blog

```http
DELETE /api/blog/:id
```

---

## Search Blogs

```http
GET /api/blog/search?term=node
```

Searches:

* title
* content
* category
* tags

Example:

```http
GET /api/blog/search?term=mongodb
```

---

# Slug Generation

A slug is automatically generated from the blog title.

Example:

```txt
Learn Node.js With Express
```

becomes

```txt
learn-node-js-with-express
```

The slug is automatically updated whenever the title changes.

---

# Redis Caching

The API uses Redis caching to reduce database queries and improve performance.

Example cache keys:

```bash
blog:685f123456789abcdef12345
```

Cached data automatically expires after a configured time.

Benefits:

* Faster response times
* Reduced MongoDB load
* Better scalability

---

# Error Handling

Centralized error handling middleware manages:

* Invalid IDs
* Missing fields
* Validation errors
* Database errors
* Unknown routes
* Server errors

Example:

```json
{
  "success": false,
  "message": "Blog not found"
}
```

---

# Graceful Shutdown

The server supports graceful shutdown using:

* SIGINT
* SIGTERM

This ensures proper cleanup before the application exits.

---

# Future Improvements

* JWT Authentication
* User Roles & Permissions
* Pagination
* Comment System
* Like System
* Swagger Documentation
* Docker Support
* Unit Testing
* TypeScript Migration
* Request Validation with Zod
* CI/CD Integration

---

# Learning Goals

This project helped me learn:

* Express.js fundamentals
* REST API design
* MongoDB & Mongoose
* Redis caching
* Error handling patterns
* Environment variables
* Project architecture
* CRUD operations
* Search functionality
* Backend best practices

---

# Author

Ankit Saini

GitHub:
https://github.com/Ankitsaini406
