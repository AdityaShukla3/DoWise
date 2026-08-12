# Environment Variables Setup

## Server Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/dowise

# JWT Secret Key (change this in production!)
JWT_SECRET=your_jwt_secret_key_here

# Server Port (optional, defaults to 5000)
PORT=5000

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:3000
```

## Client Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000
```

**Note:** React requires the `REACT_APP_` prefix for environment variables to be accessible in the browser.

