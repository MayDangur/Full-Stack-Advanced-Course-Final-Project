# TaxWise Israel

TaxWise Israel is a full-stack web application for managing tax refund requests, personal documents, and user information in a simple and secure personal area.

The project was developed as the final project for the Full Stack Advanced Course.

## Live Application

**Frontend:**
https://taxwise-israel.vercel.app

**Backend:**
https://taxwise-backend.onrender.com

## Main Features

* User registration and login
* Google authentication
* Email verification
* Passwordless magic-link login
* JWT-based authentication
* Role-based authorization for users and administrators
* Protected client and server routes
* Personal user area
* Admin Panel for managing client tax requests
* Create, read, update and delete tax requests
* Tax request status tracking
* Admin approval and rejection of tax requests
* Admin access to client request documents
* Upload, view, download and delete documents
* Upload, update and remove profile images
* Update profile name
* Delete user account and related data
* Client-side React form validation
* Server-side JOI validation
* Loading and error states
* Responsive user interface
* Persistent authentication during the browser session

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Context API
* Redux Toolkit
* Google OAuth

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
* Google APIs

### Media & Deployment

* Cloudinary
* Vercel
* Render

## Project Structure

The application is divided into separate frontend and backend layers.

The frontend is built as a React Single Page Application and contains pages, reusable components, authentication context, Redux state management, and API services.

The backend follows a structured architecture using routes, middleware, controllers, models, validation, and database configuration.

Business logic is separated into controllers, while route files are responsible for defining API endpoints and applying the appropriate middleware.

## Database Structure

The application uses three main MongoDB collections:

* `users` - stores registered users, authentication data, roles, and profile information.
* `taxrequests` - stores tax refund requests and references the user who created each request.
* `documents` - stores document metadata and references the tax request to which each document belongs.

The main relationship structure is:

```text
User → Tax Requests → Documents
```

Mongoose references are used to connect the collections.

## Authentication

Authentication is implemented using JWT.

After login, the JWT is stored in `sessionStorage`. This allows the user to remain authenticated when refreshing the page while requiring a new login after the browser session ends.

Protected routes are implemented on both the frontend and backend.

The application also supports role-based authorization. Regular users can access their own personal area and resources, while administrators have access to protected administrative functionality.

## Tax Requests

Authenticated users can:

* Create tax refund requests
* View their requests
* Edit existing requests
* Delete requests
* Track request status

Tax requests are stored in MongoDB and connected to their users through Mongoose relationships.

## Admin Panel

The application includes a protected Admin Panel for administrative request management.

Administrators can:

* View tax requests submitted by all clients
* View basic client information associated with each request
* View documents associated with client requests
* Update request status
* Approve requests
* Reject requests

Administrative functionality is protected on both the frontend and backend.

Backend admin routes require authentication and administrator authorization before the relevant controller is executed.

Regular users cannot access the Admin Panel or its protected API functionality.

## Documents

Users can upload documents related to their tax requests.

Supported document functionality includes:

* Upload
* View supported files
* Download
* Delete

Documents are connected to their corresponding tax requests in MongoDB and stored using Cloudinary.

Document operations verify that the relevant tax request belongs to the authenticated user.

Deleting a tax request also removes its associated documents.

## Profile Image

Users can:

* Upload a profile image
* Replace an existing profile image
* Remove their profile image

Profile images are stored using Cloudinary and associated with the authenticated user.

## Profile Management

Authenticated users can:

* Update their profile name
* Delete their account

Deleting an account permanently removes the user, their tax requests, associated document records, uploaded documents, and profile image.

## Validation and Security

The application includes:

* React form validation
* Server-side JOI validation
* JOI validation for tax requests
* JOI validation for registration, login, and profile name updates
* Password hashing with bcrypt
* JWT verification
* Protected API routes
* Role-based admin authorization
* Global error handling
* Helmet security headers
* Rate limiting

Unexpected controller errors are forwarded to a centralized global error-handling middleware, providing consistent server-side error handling.

## Performance

The frontend uses:

* React lazy loading
* `React.memo`

These features help reduce unnecessary loading and rendering.

## API Endpoints

| Method | Endpoint                            | Description                            | Authentication |
| ------ | ----------------------------------- | -------------------------------------- | -------------- |
| POST   | `/api/auth/register`                | Register a new user                    | No             |
| POST   | `/api/auth/login`                   | Log in with email and password         | No             |
| POST   | `/api/auth/google`                  | Sign in with Google                    | No             |
| GET    | `/api/auth/verify-email`            | Verify a user's email address          | No             |
| POST   | `/api/auth/magic-login`             | Request a magic login link             | No             |
| GET    | `/api/auth/magic-login/verify`      | Verify a magic login link and sign in  | No             |
| GET    | `/api/auth/me`                      | Get the currently authenticated user   | Yes            |
| PUT    | `/api/auth/profile-name`            | Update profile name                    | Yes            |
| PUT    | `/api/auth/profile-image`           | Upload or update profile image         | Yes            |
| DELETE | `/api/auth/profile-image`           | Remove profile image                   | Yes            |
| DELETE | `/api/auth/account`                 | Delete user account and related data   | Yes            |
| POST   | `/api/tax-requests`                 | Create a tax request                   | Yes            |
| GET    | `/api/tax-requests`                 | Get the current user's tax requests    | Yes            |
| GET    | `/api/tax-requests/:id`             | Get a specific tax request             | Yes            |
| PUT    | `/api/tax-requests/:id`             | Update a tax request                   | Yes            |
| DELETE | `/api/tax-requests/:id`             | Delete a tax request                   | Yes            |
| POST   | `/api/documents/upload`             | Upload a document                      | Yes            |
| GET    | `/api/documents/:taxRequestId`      | Get documents for a tax request        | Yes            |
| DELETE | `/api/documents/:id`                | Delete a document                      | Yes            |
| GET    | `/api/admin/requests`               | Get all client tax requests            | Admin          |
| GET    | `/api/admin/requests/:id/documents` | Get documents for a client tax request | Admin          |
| PATCH  | `/api/admin/requests/:id/status`    | Update a tax request status            | Admin          |

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd TaxWise-Israel
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

Use the provided `.env.example` files as templates for the required environment variables.

Required backend environment variables:

```env
PORT=
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
CLIENT_URL=
```

Required frontend environment variables:

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

**Do not commit real secrets or credentials to GitHub.**

### 5. Run the Application

Run the backend from the project root:

```bash
npm run dev
```

Run the frontend from the `client` directory:

```bash
npm run dev
```

## Final Project

This project demonstrates an end-to-end Full Stack application using React, Node.js, Express, MongoDB, authentication, authorization, state management, media handling, validation, security, administration functionality, and cloud deployment.