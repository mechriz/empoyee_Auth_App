# 🧑‍💼 Employee Authentication System

A full-stack role-based employee authentication system for **Fortune Technologies Limited**, featuring secure login, profile setup, dashboards for users and admins, and a fully styled frontend using a modern orange-blue theme.

---

## 📌 Features

### ✅ Authentication
- Register/Login with secure password hashing
- Role-based access control: `user` and `admin`
- JWT-based authentication

### ✅ Profile Management
- After login, employees without a profile are redirected to `/profile-setup`
- Setup includes department, designation, full name, date joined
- Auto-generated employee ID (e.g. `EMP-1001`)

### ✅ Dashboards
- **User Dashboard:** Displays personal profile info
- **Admin Dashboard:** View, edit, delete all users with pagination

### ✅ Navigation & UI
- Responsive navigation bar with logout
- Route-based redirection post login
- Individual page styling using **orange-blue** theme
- Smooth user flow from login → setup/profile → dashboard

---

## 🛠️ Tech Stack

| Layer    | Technology             |
|----------|------------------------|
| Frontend | React (Vite)           |
| Backend  | Node.js, Express       |
| Database | MySQL                  |
| Auth     | JWT (JSON Web Tokens)  |
| Styling  | CSS / Custom Theme     |
| Testing  | Postman (for API test) |

---

## 🚀 Getting Started

### ⚙️ Backend Setup

```bash
cd employee-auth-backend
npm install
node index.js
```

## ⚙️ Environment Configuration

Make sure your `.env` file in the backend directory contains your database credentials:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_database
DB_NAME=auth_system
JWT_SECRET=your_jwt_secret
```


###  🌐 Frontend Setup
```bash
cd employee-auth-frontend
npm install
npm run dev
```
- Frontend runs at: http://localhost:5173
- Backend runs at: http://localhost:5000

### 🧭 Routes Overview
## 🔐 Auth
- |Method	Endpoint	Description
- POST	/api/auth/register	Register user
- POST	/api/auth/login	Login user

## 👤 Profile
- Method	- Endpoint	            - Description
- POST	  - /api/profile/setup	  - Setup employee profile      
- GET     -	/api/profile/check	  - Check if profile exists    
- GET	    -   /api/profile/me	    - Get current user profile 

## 🛠️ Admin
- Method	  -   Endpoint	            - Description
- GET	      - /api/admin/users	      - View users (paginated)
- PUT	      - /api/admin/users/:id	  - Edit user (admin only)
- DELETE	  - /api/admin/users/:id	  - Delete user (admin only)

## 🎨 UI Flow
- Login Page – / or /login

- Register Page – /register

- Profile Setup – /profile-setup

- User Dashboard – /dashboard/user

- Admin Dashboard – /dashboard/admin

- Logout – Clears localStorage and redirects to login



## 🤝 Credits
Built with ❤️ by CHRISTOPHER OBEGI for Fortune Technologies Limited
