# Grapevine - A Manifest Application

Welcome to Grapevine, a web application for cataloging and exploring grape varieties. This project is a complete, full-stack application built using React for the frontend and Manifest for the backend.

## Features

- **User Authentication**: Secure sign-up and login for users (Vintners and Enthusiasts).
- **Grape Variety Management**: Create, Read, Update, and Delete grape variety entries.
- **Image Uploads**: Attach photos to each grape variety, powered by Manifest's file storage.
- **Role-Based Access Control**: Vintners can add and manage their own entries, while all users can browse the collection.
- **Auto-generated Admin Panel**: A complete admin interface at `/admin` for managing all data, users, and settings.

## Tech Stack

- **Backend**: [Manifest](https://manifest.build) - A no-code/low-code backend platform that auto-generates APIs, databases, and admin panels from a simple YAML configuration.
- **Frontend**: React, Vite, Tailwind CSS
- **SDK**: `@mnfst/sdk` for seamless frontend-backend integration.

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies**: `npm install`
3.  **Run the frontend development server**: `npm run dev`
4.  The application will be available at `http://localhost:5173`.

### Backend Setup

The backend is fully defined in the `manifest.yml` file and is automatically deployed and managed by the Manifest platform. No additional backend setup is required.

### Demo Credentials

- **Vintner User**: `vintner@demo.com` / `password`
- **Admin Panel**: Access at `/admin` with `admin@manifest.build` / `admin`
