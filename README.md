# 🌟 InnerLight

> **An AI-powered mental wellness companion for reflection, emotional awareness, and self-guided support.**

InnerLight is a full-stack AI-powered mental wellness platform designed to give users a private space to **track their emotions, journal their thoughts, explore self-help resources, and interact with an AI wellness companion**.

The goal is simple: make everyday mental wellness tools more accessible through a calm, supportive, and stigma-free digital experience.

> ⚠️ **Disclaimer:** InnerLight is a wellness and self-reflection application, not a replacement for professional medical or psychiatric care.

---

## ✨ Features

### 🤖 AI Wellness Assistant

Interact with **Lumi**, InnerLight's AI wellness companion, for conversational support, reflection prompts, and general wellness guidance.

### 🧠 Mood Tracking

Track your daily emotional state and build a history of your moods over time.

Users can:

* Record their current mood
* Add context to their emotional state
* Review previous mood entries
* Identify emotional patterns over time

### 📓 AI Journaling

Write private journal entries and use AI-assisted reflection to better understand thoughts, emotions, and experiences.

### 📊 Mood History & Insights

Visualize previous mood entries to make emotional patterns easier to understand and reflect on.

### 📚 Self-Help Library

Access curated self-help content, exercises, and resources focused on areas such as:

* Stress management
* Emotional awareness
* Mindfulness
* Personal growth
* Self-reflection

### 🔐 Authentication & Privacy

Protected user accounts with JWT-based authentication ensure that users can access and manage their own personal data.

### 📱 Responsive Interface

A clean and responsive interface designed to provide a comfortable experience across desktop and mobile devices.

---

## 🧩 How It Works

```text
                         INNERLIGHT
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        Mood Tracking      Journaling     Self-Help
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                       Personal Insights
                              │
                              ▼
                    ┌──────────────────┐
                    │  AI Companion    │
                    │      Lumi        │
                    └──────────────────┘
                              │
                              ▼
                    Reflection & Support
```

The application combines structured mood tracking with free-form journaling and AI-powered conversations to create a more personalized wellness experience.

---

## 🏗️ Architecture

InnerLight follows a modular full-stack architecture with a separate frontend and backend.

```text
┌───────────────────────────────┐
│          React Client         │
│     Tailwind CSS + UI         │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│       Node.js + Express       │
│                               │
│  Authentication               │
│  Mood Management              │
│  Journal Management           │
│  AI Integration               │
│  User APIs                    │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Cloudinary  │
│ User Data    │  │    Storage   │
│ Mood Data    │  └──────────────┘
│ Journal Data │
└──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* JavaScript
* Responsive UI

### Backend

* Node.js
* Express.js
* REST APIs
* Modular backend architecture

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* Protected API routes

### AI

* LLM-powered conversational wellness assistant
* AI-assisted journaling and reflection

### Storage

* Cloudinary

### Deployment

* Vercel
* Render

---

## 📂 Project Structure

```text
innerlight/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── README.md
└── ...
```

---

## 🔐 Authentication Flow

InnerLight uses JWT-based authentication to protect user-specific resources.

```text
User
 │
 │ Register / Login
 ▼
Express API
 │
 ├── Validate credentials
 │
 ├── Generate JWT
 │
 ▼
Client
 │
 │ Authorization Token
 ▼
Protected API Routes
 │
 ▼
User-specific Data
```

This allows resources such as moods, journals, and personal information to remain associated with the authenticated user.

---

## 📊 Mood Tracking Flow

```text
User records mood
        │
        ▼
Frontend sends API request
        │
        ▼
Authentication middleware
        │
        ▼
Mood controller
        │
        ▼
MongoDB
        │
        ▼
Mood history retrieved
        │
        ▼
Frontend visualization
```

This creates a simple feedback loop where users can record emotions and later reflect on their emotional history.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas
* Git

### 1. Clone the repository

```bash
git clone https://github.com/tassu1/innerlight.git

cd innerlight
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by your AI and Cloudinary integrations.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local development URL shown by Vite in your browser.

---

## 🌐 Live Demo

**Live Application:**
https://innerlight-beta.vercel.app/

---

## 🧠 Engineering Highlights

Building InnerLight provided hands-on experience with:

* Designing a full-stack MERN application
* Building RESTful APIs with Express
* JWT authentication and protected routes
* MongoDB schema design with Mongoose
* User-specific data isolation
* AI API integration
* Mood tracking and historical data visualization
* Frontend-backend API integration
* Modular backend architecture
* Cloudinary-based asset storage
* Deploying frontend and backend independently
* Handling production CORS and environment configuration

---

## 🔮 Future Roadmap

Potential improvements include:

* 📈 Advanced mood analytics
* 🧠 Personalized AI wellness insights
* 🗓️ Long-term emotional trend analysis
* 🔔 Journaling and reflection reminders
* 🎯 Personalized wellness goals
* 📱 Progressive Web App support
* 🔒 Enhanced data encryption
* 📤 Personal data export
* 🧩 More structured self-help programs
* 🤖 More context-aware AI conversations

---

## 🎯 Vision

InnerLight aims to make self-reflection and everyday mental wellness tools easier to access.

Instead of treating wellness as something users only think about when things become overwhelming, InnerLight focuses on **small, consistent interactions** — tracking how you feel, writing down what is on your mind, learning from your patterns, and having a supportive space to reflect.

---

## 👨‍💻 Author

**Tahseen**

Full Stack Developer & Product Builder

* GitHub: https://github.com/tassu1
* Portfolio: https://tassu1.vercel.app/

---

⭐ **If you find InnerLight interesting, consider starring the repository.**
