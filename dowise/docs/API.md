# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

### Plan Routes

#### GET `/api/plans`
Get all plans for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "plan_id",
    "name": "Frontend Development",
    "tasks": [...],
    "userId": "user_id"
  }
]
```

#### POST `/api/plans`
Create a new learning plan.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Frontend Development",
  "tasks": [
    {
      "title": "Learn HTML",
      "days": 5,
      "resource": "https://example.com"
    }
  ]
}
```

### Template Routes

#### GET `/api/templates`
Get all available learning templates.

**Response:**
```json
[
  {
    "id": "template_id",
    "name": "Frontend",
    "tasks": [...]
  }
]
```

### AI Routes

#### POST `/api/ai/suggest`
Get AI-powered suggestions for learning input.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "input": "I want to learn React"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "title": "React Basics",
      "days": 7,
      "resource": "https://react.dev"
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error message here",
  "error": "Error details"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

