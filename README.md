
---

# SchemaArchitect AI

**SchemaArchitect AI** is a **MERN stack application** that allows developers to visually design database schemas and generate backend-ready code using AI.

It simplifies schema planning, accelerates backend development, and reduces boilerplate work.

---

##  Demo & Website

*  **Live Website:** [https://schemaarchitect-ai.vercel.app](https://schemaarchitect-ai.vercel.app)
*  **Demo Video:** [https://youtu.be/your-demo-video-link](https://youtu.be/your-demo-video-link)
*  **GitHub Repository:** [https://github.com/ShivasaiCEng/SchemaArchitectAI](https://github.com/ShivasaiCEng/SchemaArchitectAI)

> ⚠️ If the live site is unavailable, please refer to the demo video or run the project locally using the steps below.

---

## Overview

* Visual database schema designer
* AI-powered backend code generation
* Supports multiple databases
* Built with a modern MERN stack

---

## Project Structure

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
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Schema.js
│   │   │   └── GeneratedCode.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── schema.controller.js
│   │   │   ├── codegen.controller.js
│   │   │   └── sandbox.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── schema.routes.js
│   │   │   ├── codegen.routes.js
│   │   │   └── sandbox.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── gemini.service.js
│   │   │   └── schema.service.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
├── package.json
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

## Prerequisites

* Node.js **v18+**
* npm or yarn
* MongoDB (local or Atlas)

---

## Installation

### Install everything at once (recommended)

```bash
npm run install:all
```

### OR install manually

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

---

## Features

* Visual schema designer
* Real-time collaboration
* Backend code generation (MongoDB, PostgreSQL, MySQL)
* API sandbox testing
* Fully responsive UI

---

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS
**Backend:** Express.js, MongoDB (Mongoose), Zod

---

