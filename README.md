Here’s a **clean, professional README.md** you can directly use for **SchemaArchitectAI**, strictly based on the data you provided and formatted for recruiters + GitHub clarity.

---

#  SchemaArchitect AI

**SchemaArchitect AI** is a **MERN stack application** that allows developers to visually design database schemas and generate backend-ready code using AI.

It simplifies schema planning, accelerates backend development, and reduces boilerplate work.

---

##  Overview

* Visual database schema designer
* AI-powered backend code generation
* Supports multiple databases
* Built with a modern MERN stack

---

##  Project Structure

```
schemaarchitect-ai/
│
├── frontend/                         # React + Vite frontend
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                   # Images, icons, static assets
│   │   │
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/               # Buttons, modals, loaders
│   │   │   ├── layout/               # Navbar, Sidebar, Footer
│   │   │   └── ui/                   # Tailwind-based UI components
│   │   │
│   │   ├── pages/                    # Application pages
│   │   │   ├── Auth/                 # Login, Register pages
│   │   │   ├── Dashboard/            # User dashboard
│   │   │   ├── SchemaDesigner/        # Visual schema builder
│   │   │   ├── CodeGenerator/         # AI-generated backend code
│   │   │   └── Sandbox/               # API testing sandbox
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │
│   │   ├── context/                  # React Context (Auth, Schema state)
│   │   │
│   │   ├── services/                 # API calls (Axios)
│   │   │   └── api.js
│   │   │
│   │   ├── utils/                    # Helper functions
│   │   │
│   │   ├── styles/                   # Global styles
│   │   │
│   │   ├── App.jsx                   # Root React component
│   │   ├── main.jsx                  # React DOM entry point
│   │   └── index.css                 # Tailwind base styles
│   │
│   ├── .env                          # Frontend environment variables
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── config/                   # Configurations
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── env.js
│   │   │
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Schema.js
│   │   │   └── GeneratedCode.js
│   │   │
│   │   ├── controllers/              # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── schema.controller.js
│   │   │   ├── codegen.controller.js
│   │   │   └── sandbox.controller.js
│   │   │
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── schema.routes.js
│   │   │   ├── codegen.routes.js
│   │   │   └── sandbox.routes.js
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── gemini.service.js     # AI code generation
│   │   │   └── schema.service.js
│   │   │
│   │   ├── middlewares/              # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── utils/                    # Helper utilities
│   │   │
│   │   ├── validators/               # Zod validation schemas
│   │   │
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   │
│   ├── .env                          # Backend environment variables
│   └── package.json
│
├── .gitignore
├── package.json                      # Root scripts (dev, install:all)
├── README.md
└── LICENSE

```

---

## ⚠️ Important Note (Very Important)

 **Access the Frontend Only**

* **Frontend URL:** [http://localhost:5173](http://localhost:5173)
* **Backend URL:** [http://localhost:5000](http://localhost:5000) (API only)

❌ If you see **"Cannot GET /"**, you are opening the backend directly.
 Always open the **frontend URL**.

---

##  Prerequisites

* Node.js **v18+**
* npm or yarn
* MongoDB (local or Atlas)

---

##  Installation

### Install everything at once (recommended)

```bash
npm run install:all
```

### OR install manually

```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

---

##  Running the Application

### Development Mode (Frontend + Backend)

```bash
npm run dev
```

This starts:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:5000](http://localhost:5000)

---

### Run Separately

#### Frontend only

```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

#### Backend only

```bash
npm run dev:backend
# or
cd backend && npm run dev
```

---

##  Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

#### MongoDB Connection Examples

* **Local MongoDB**

```
mongodb://localhost:27017/schemaarchitect
```

* **MongoDB Atlas**

```
mongodb+srv://username:password@cluster.mongodb.net/schemaarchitect?retryWrites=true&w=majority
```

* **MongoDB with Auth**

```
mongodb://username:password@localhost:27017/schemaarchitect
```

🔹 **Notes**

* `JWT_SECRET` should be a strong random string
* `GEMINI_API_KEY` enables AI-powered code generation
* If not provided, the app uses a **mock generator** (limited functionality)

---

### Frontend (`frontend/.env`) *(Optional)*

```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_api_key_here
```

---

##  Features

*  Visual schema designer
*  Real-time collaboration
*  Backend code generation

  * MongoDB
  * PostgreSQL
  * MySQL
*  API sandbox testing
*  Fully responsive UI

---

## 🛠 Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Lucide React Icons

### Backend

* Express.js
* MongoDB (Mongoose)
* Zod (validation)




