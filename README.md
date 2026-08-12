# TaxWise Israel

TaxWise Israel is a full-stack web application for managing tax refund requests, personal documents, and user information in a simple and secure personal area.

The project was developed as the final project for the Full Stack Advanced Course.

## Live Application

**Frontend:**
https://full-stack-advanced-course-final-pr.vercel.app

**Backend:**
https://taxwise-backend.onrender.com

## Main Features

* User registration and login
* Google authentication
* JWT-based authentication
* Protected client and server routes
* Personal user area
* Create, read, update and delete tax requests
* Tax request status tracking
* Upload, view, download and delete documents
* Upload, update and remove profile images
* Form validation
* Loading and error states
* Responsive user interface
* Session-based authentication behavior

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Context API
* Redux Toolkit

### Backend

* Node.js
* Express
* TypeScript
* MongoDB Atlas
* Mongoose
* JOI
* JWT
* bcrypt
* Multer
* Helmet
* Express Rate Limit

### Media & Deployment

* Cloudinary
* Vercel
* Render

## Project Structure

The application is divided into separate frontend and backend layers.

The frontend is built as a React Single Page Application and contains pages, reusable components, authentication context, Redux state management, and API services.

The backend follows a structured architecture using routes, middleware, controllers, models, validation, and database configuration.

## Authentication

Authentication is implemented using JWT.

After login, the JWT is stored in `sessionStorage`. This allows the user to remain authenticated when refreshing the page while requiring a new login after the browser session ends.

Protected routes are implemented on both the frontend and backend.

## Tax Requests

Authenticated users can:

* Create tax refund requests
* View their requests
* Edit existing requests
* Delete requests
* Track request status

Tax requests are stored in MongoDB and connected to their users through Mongoose relationships.

## Documents

Users can upload documents related to their tax requests.

Supported document functionality includes:

* Upload
* View supported files
* Download
* Delete

Deleting a tax request also removes its associated documents.

## Profile Image

Users can:

* Upload a profile image
* Replace an existing profile image
* Remove their profile image

## Validation and Security

The application includes:

* React form validation
* Server-side JOI validation
* Password hashing with bcrypt
* JWT verification
* Protected API routes
* Global error handling
* Helmet security headers
* Rate limiting

## Performance

The frontend uses:

* React lazy loading
* `React.memo`

These features help reduce unnecessary loading and rendering.

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Full-Stack-Advanced-Course-Final-Project
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Environment Variables

Create the required `.env` files and configure the environment variables used by the project.

Examples of required configuration include:


MONGO_URI=
JWT_SECRET=
```

Frontend configuration may include:


VITE_API_URL=


Additional authentication and media-service environment variables should also be configured according to the project's local environment.

**Do not commit real secrets or credentials to GitHub.**

### 5. Run the Application

Run the backend from the project root using the project's development script.

Run the frontend from the `client` directory:

```bash
npm run dev
```

## Final Project

This project demonstrates an end-to-end Full Stack application using React, Node.js, Express, MongoDB, authentication, state management, media handling, validation, security, and cloud deployment.
