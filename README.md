# AI Interview Platform

Production-grade AI-powered Interview Platform built using the MERN stack with AI voice interaction, automated evaluation, PDF reporting, email scheduling, and role-based interview flows.

---

# 🚀 Features

## 🎤 AI Voice Interview System

* Real-time AI interviewer
* Human-like interview conversation flow
* AI-generated follow-up questions
* Text-to-Speech integration (Sarvam AI)
* Speech-to-Text answer capture
* Fullscreen interview enforcement
* Tab-switch detection
* Auto skip handling
* Timer-based interview flow

---

## 🧠 AI Interview Types

### Technical Interview

* Theory-based technical questions
* Topic-specific interviews
* Difficulty levels:

  * Easy
  * Intermediate
  * Hard

Supported Topics:

* Java
* Python
* C
* C++
* React
* Node.js
* MongoDB
* DBMS
* Operating Systems
* REST APIs
* Authentication
* Express.js
* Data Structures
* And more

---

### HR Interview

* Communication-based questions
* Behavioral assessment
* Confidence analysis
* Personality evaluation
* Leadership and teamwork assessment

---

### Practical Interview

* Coding-based interview flow
* Language-specific questions
* Difficulty-based coding tasks
* Real implementation problems
* Logic-building questions

Supported Languages:

* Java
* Python
* C
* C++

---

# 📊 AI Evaluation System

The platform performs detailed AI-based interview evaluation including:

* Technical correctness
* Communication quality
* Confidence level
* Pronunciation
* Problem-solving ability
* Coding logic
* Grammar analysis
* Overall performance

### Evaluation Output

* Marks out of 100
* Detailed feedback
* Strengths
* Weaknesses
* Improvement suggestions
* AI summary
* Final result:

  * Pass
  * Borderline
  * Fail

---

# 📄 PDF Report Generation

Automatically generates professional PDF reports containing:

* Candidate information
* Interview summary
* Performance analytics
* AI feedback
* Question & Answer history
* Coding responses
* Performance graphs
* Final evaluation result

Reports are uploaded to Cloudinary and sent directly to candidates via email.

---

# 📧 Email System

Automated email features:

* Interview scheduling emails
* Secure interview token delivery
* Professional HTML email templates
* PDF report delivery
* Downloadable report links

---

# 🔐 Security Features

* JWT Authentication
* Admin Protected Routes
* Token-based interview access
* Rate limiting
* Secure environment variables
* CORS protection
* Fullscreen enforcement
* Tab-switch restriction

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* GSAP Animations
* Axios
* React Hot Toast
* Vite
* CSS3

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Nodemailer
* Cloudinary
* Groq AI
* Sarvam AI TTS

---

# ☁️ Deployment

## Frontend Deployment

* Vercel

## Backend Deployment

* Render

## Database

* MongoDB Atlas

## File Storage

* Cloudinary

---

# 📁 Project Structure

```bash
ai-interview/
│
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── api/
│   ├── styles/
│   └── App.jsx
│
└── README.md
```

---

# ⚙️ Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

FRONTEND_URL=your_frontend_url

MAIL_USER=your_email
MAIL_PASS=your_app_password

GROQ_API_KEY=your_groq_api_key

SARVAM_API_KEY=your_sarvam_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## Frontend (.env)

```env
VITE_API_URL=your_backend_url/api

VITE_BACKEND_URL=your_backend_url
```

---

# ▶️ Local Development Setup

## Clone Repository

```bash
git clone https://github.com/vikas-gaur9899/ai-interview.git
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

# ▶️ Run Project

## Backend

```bash
cd backend
npm run dev
```

---

## Frontend

```bash
cd frontend
npm run dev
```

---

# 🌐 Live Deployment Flow

## Backend Deployment (Render)

### Root Directory

```bash
backend
```

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

---

## Frontend Deployment (Vercel)

### Root Directory

```bash
frontend
```

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

---

# 🔥 Production Notes

* Render free tier may sleep after inactivity.
* First backend request may take 30–50 seconds.
* Use Google Chrome for best interview experience.
* Enable microphone permissions before interview.
* Stable internet connection is recommended.

---

# 👨‍💻 Developed By

## Samrat Sharma

AI Interview Platform — e-Definers Technologies

---

# 📜 License

This project is for educational and professional demonstration purposes.
