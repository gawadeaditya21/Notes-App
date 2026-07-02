# NoteFlow (MERN Notes App)

NoteFlow is a modern, premium Notes application built with the MERN stack (MongoDB, Express, React, Node.js). It features a sleek "Studio Workspace" architecture, an interactive masonry grid layout, and a distraction-free rich text drawer.

## ✨ Key Features

- **Studio Workspace UI:** A full-viewport, distraction-free environment with a slim sidebar, floating action buttons (FAB), and a fluid masonry grid.
- **Rich Text Editing:** Integrated with `react-quill-new` for powerful, formatted note-taking directly inside a smooth slide-in right drawer.
- **Favorites & Tags:** Instantly star your favorite notes, create and manage tags (pill UI), and filter your workspace dynamically.
- **Instant Search:** Client-side, real-time search across note titles, contents, and tags using the `Ctrl+K` keyboard shortcut.
- **Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Dark/Light Mode:** Seamless theme toggling that persists across sessions.
- **Responsive Design:** Optimized for both desktop and mobile screens.

## 🛠 Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router DOM v6
- React Quill New (Rich Text)
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Pure CSS / CSS Variables for theming

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (Password Hashing)
- CORS & Dotenv

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gawadeaditya21/Notes-App.git
cd Notes-App
```

### 2. Environment Variables Setup

You will need to create two `.env` files, one for the backend and one for the frontend (if needed).

**Backend `.env`:**
Navigate to the `backend` directory and create a `.env` file:
```bash
cd backend
touch .env
```
Add the following variables to your `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend `.env`:**
Navigate to the `frontend` directory and create a `.env` file:
```bash
cd ../frontend
touch .env
```
Add the following variables to your `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Note: If your API is hardcoded to `/api` in `utils/api.js`, make sure it points to the correct backend port).*

### 3. Install Dependencies

You need to install npm packages for both the backend and frontend separately.

**Install Backend Dependencies:**
```bash
cd ../backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

### 4. Run the Application

You'll need two terminal windows/tabs to run the backend and frontend simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will now be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
Notes-App/
│
├── backend/                  # Express/Node.js Server
│   ├── config/               # Database configuration
│   ├── controllers/          # API Route controllers (Auth, Notes)
│   ├── models/               # Mongoose schemas (User, Note)
│   ├── routes/               # Express routes
│   └── server.js             # Backend entry point
│
├── frontend/                 # React/Vite Client
│   ├── src/
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── pages/            # Page components (Home, Login, Register)
│   │   ├── utils/            # Axios API instances & helpers
│   │   ├── App.jsx           # Main React component & Routing
│   │   └── index.css         # Global styles & design tokens
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/gawadeaditya21/Notes-App/issues).


