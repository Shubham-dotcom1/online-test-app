# Online Test Portal (MERN Stack)

A modern, full-stack Computer Science & Technical MCQ assessment platform built with MongoDB, Express.js, React (Vite + Tailwind CSS), and Node.js.

Designed with a clean, high-contrast, light-mode interface modeled after internal corporate and university evaluation systems.

---

## Key Features

### Student Experience
- **Public Assessment Landing Page:** Responsive hero showcase with category filters and test specifications.
- **Secure Authentication:** JWT-based signup and login with hashed passwords via `bcryptjs`.
- **Timed Online Assessments:** 10-minute automated countdown timer with seamless auto-submission on timeout.
- **Interactive Question Palette:** Free back-and-forth question navigation, answer tracking, and status indicators.
- **Tamper-Proof Server-Side Grading:** Correct answers remain on the backend until submission to ensure integrity.
- **Detailed Scorecard & Review:** Instant post-submission breakdown showing selected answers, correct answers, and percentages.
- **Attempt History:** Log of past test scores, timestamps, and detailed review links.

### Admin Experience
- **Role-Based Access Control (RBAC):** Dedicated, secure admin route guarded by JWT middleware and role checks.
- **Live Platform Metrics:** Real-time counters for questions in the pool, registered students, completed submissions, and domain categories.
- **Question Bank Management:** Add new 4-option questions with real-time validation, search by keyword, filter by category, and delete with confirmation dialogs.
- **Student Submissions Audit:** Live log of all candidate test attempts, accuracy scores, and timestamps.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, CORS, Dotenv |
| **Database** | MongoDB Atlas / Local MongoDB |

---

## Project Structure

```
online-test-app/
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js          # Express app entry & DB connection
│   ├── seed.js            # Default admin, student & question seeder
│   ├── middleware/
│   │   └── auth.js        # JWT verify & adminOnly guards
│   ├── models/
│   │   ├── User.js        # User model with bcrypt pre-save
│   │   ├── Question.js    # 4-option MCQ schema
│   │   └── Attempt.js     # Test submission & answer record schema
│   └── routes/
│       ├── auth.js        # /api/auth (register, login, me)
│       ├── test.js        # /api/test (questions, submit, history)
│       └── admin.js       # /api/admin (stats, questions, attempts)
└── frontend/
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    │   └── hero-illustration.png
    └── src/
        ├── main.jsx
        ├── App.jsx        # Routing & auth-guarded routes
        ├── index.css
        ├── api/
        │   └── axios.js   # Axios instance with Bearer token interceptor
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── HeroIllustration.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Test.jsx
            ├── Result.jsx
            ├── History.jsx
            └── Admin.jsx
```

---

## Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://cloud.mongodb.com/) account or a local MongoDB server

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example`:

```bash
# Windows PowerShell
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Configure your `.env` variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/online_test?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

> **Note:** If your MongoDB password contains special characters like `@`, ensure it is URL-encoded (e.g. `@` becomes `%40`).

Seed default accounts and 12 sample questions:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
# Server will run on http://localhost:5000
```

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file from `.env.example`:

```bash
# Windows PowerShell
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
# Frontend will be live at http://localhost:5173
```

---

## Default Credentials (After Seeding)

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@example.com` | `password123` | Take tests, view scorecard & history |
| **Admin** | `admin@example.com` | `password123` | Question bank management & audit logs |

*(New student accounts can also be created freely through the Sign Up page).*

---

## API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a student account
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `GET /api/auth/me` - Get profile of the logged-in user (Protected)

### Assessments (`/api/test`)
- `GET /api/test/questions` - Fetch 10 randomized questions without correct answers (Protected)
- `POST /api/test/submit` - Grade answers on backend and save attempt (Protected)
- `GET /api/test/history` - List past attempts for logged-in user (Protected)
- `GET /api/test/history/:id` - Get full question breakdown for a specific attempt (Protected)

### Administration (`/api/admin`)
- `GET /api/admin/stats` - Platform metrics (Questions, Students, Attempts) (Admin Only)
- `GET /api/admin/questions` - List all questions with correct answers (Admin Only)
- `POST /api/admin/questions` - Add a new validated question (Admin Only)
- `DELETE /api/admin/questions/:id` - Delete a question by ID (Admin Only)
- `GET /api/admin/attempts` - View student submission audit logs (Admin Only)

---

## Security Highlights

1. **Environment Protection:** All sensitive credentials (`MONGO_URI`, `JWT_SECRET`) are kept in `.env` and strictly excluded in `.gitignore`.
2. **Password Hashing:** Passwords are never stored in plain text; hashed using `bcryptjs` with salt factor 10.
3. **No Client-Side Answer Leak:** The test endpoint strips `correctAnswer` before sending questions to the browser.
4. **Strict RBAC:** Non-admin users are blocked from both frontend admin routes and backend API endpoints with HTTP 403.
5. **Autofill Hardening:** Form fields enforce `autoComplete="off"` with custom naming conventions to prevent browser credential bleeding.
