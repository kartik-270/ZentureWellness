# ZentureWellness 🧠

**Bridging the Gap: Mental Wellness for College Students**

ZentureWellness is a full-stack mental health platform designed for college students to access counseling, self-help resources, peer support, and wellness tools in one place.

---

## 🌟 Features

### User Features

* User Signup & Login (JWT Authentication)
* Personalized Dashboard
* Book Counseling Sessions
* Peer Support Community
* Self-Assessment Mental Health Tests
* Psychoeducational Resources (Articles, Videos, Audio)
* Responsive UI (Mobile + Laptop)

### Admin / Counselor Features

* Role-based access (Admin / Counselor / User)
* Manage appointments
* Monitor users
* Dashboard analytics

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Wouter (Routing)
* Lucide Icons

### Backend

* Node.js / Express (or your backend framework)
* JWT Authentication
* REST APIs

### Database

* PostgreSQL / Drizzle ORM (based on your project config)

---

## 📁 Project Structure

```
ZentureWellness/
│
├── client/            # Frontend (React)
├── server/            # Backend APIs
├── shared/            # Shared types/config
├── public/            # Static assets
├── components/        # Reusable UI components
├── drizzle.config.ts  # Database config
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kartik-270/ZentureWellness.git
cd ZentureWellness
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Environment Setup

Create a `.env` file in the root:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 4. Run the project

#### Development mode

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

## 🔐 Authentication

* Uses JWT tokens
* Token stored in `localStorage`
* Role-based redirection:

  * Admin → `/admin/dashboard`
  * Counselor → `/counsellor/dashboard`
  * User → `/`

---

## 📱 Responsive Design

* Mobile-first layout
* Optimized for:

  * Phones
  * Tablets
  * Laptops
* Tailwind breakpoints used:

  * `sm`
  * `md`
  * `lg`
  * `xl`

---

## 🎯 Key Modules

* Hero Section with dynamic login state
* Quick Links Navigation
* Appointment Booking System
* Community Support
* Self-Assessment Engine
* Psychoeducational Hub

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment

You can deploy easily using:

* Vercel (Frontend)
* Render / Railway (Backend)

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
3. Make changes
4. Commit

```bash
git commit -m "Your feature"
git push origin branch-name
```

---

## 📄 License

This project is for educational and academic purposes.

---



---

## 💡 Vision

To make mental health support accessible, private, and student-friendly through technology.
