<div align="center">

# 🚀 PromptPilot

### *Your AI-Powered Prompt Enhancement Assistant*

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Llama](https://img.shields.io/badge/Meta-Llama_3-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://ai.meta.com/)

*Transform simple ideas into powerful, detailed prompts with AI-powered intelligence*

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Architecture](#-architecture) • [API](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**PromptPilot** is a sophisticated full-stack web application that leverages advanced AI models (Google Gemini 2.5 Flash & Meta Llama 3.1) to transform simple user prompts into detailed, effective instructions. Whether you're coding, generating images, creating content, or asking questions, PromptPilot intelligently enhances your prompts to get better results from AI systems.

### 🎯 What Makes PromptPilot Special?

- **🧠 Intelligent Intent Detection**: Automatically recognizes whether you're coding, generating images, writing content, or asking questions
- **💬 Context-Aware Conversations**: Remembers previous interactions to provide relevant follow-up responses
- **🎨 Beautiful UI/UX**: Netflix-inspired startup animation, smooth transitions, and elegant chat interface
- **🔐 Secure Authentication**: JWT-based auth with token expiration and protected routes
- **⚡ Real-time Processing**: Instant prompt improvements with loading states and error handling
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **💾 Session Persistence**: Saves chat history using browser sessionStorage
- **🔄 Live Health Checks**: Backend connectivity validation on startup

---

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **AI-Powered Enhancement** | Transforms basic prompts into detailed, effective instructions using Gemini 2.5 Flash or Llama 3.1 |
| **Multi-Domain Support** | Optimizes prompts for coding, image generation, video creation, music, writing, Q&A, and more |
| **Context Memory** | Tracks conversation intent to provide relevant responses to follow-ups like "thanks" or "ok" |
| **Smart Greetings** | Handles casual conversation naturally without forcing prompt improvements |
| **Edit & Regenerate** | Edit previous user messages and automatically regenerate AI responses |

### 🎨 Frontend Features

- ⚛️ **React 19.1** with modern hooks and lazy loading
- 🎭 **Netflix-Style Startup** screen with typing animation and health checks
- 💬 **Real-time Chat Interface** with auto-scroll and message alignment
- 🎨 **Elegant UI Components**: Custom-designed Header, Sidebar, Chat bubbles, and Input
- 🔒 **Protected Routes** with automatic token expiration handling
- 🌐 **React Router** for seamless navigation
- 📦 **Code Splitting** for optimized load times
- 🎯 **Error Boundaries** for graceful error handling

### 🛠️ Backend Features

- 🐍 **Flask 3.1** with Blueprint-based architecture
- 🗄️ **MongoDB Atlas** integration for user management
- 🔐 **JWT Authentication** with 24-hour token expiration
- 🤖 **Dual LLM Support**: Google Gemini & Groq Llama 3
- 🎯 **Advanced Intent Detection** with keyword matching algorithms
- 🌐 **CORS Configuration** for multi-origin support
- ⚡ **Health Check Endpoint** for deployment monitoring
- 🛡️ **Input Validation** and error handling

---

## 🏗️ Architecture

### Project Structure

```
promptpilot-main/
│
├── 📁 backend/                     # Flask Backend
│   ├── 📁 app/
│   │   ├── 📄 __init__.py          # App factory with MongoDB & JWT
│   │   ├── 📁 routes/
│   │   │   ├── 📄 auth.py          # Authentication endpoints
│   │   │   ├── 📄 llm.py           # LLM improvement endpoint
│   │   │   └── 📄 health.py        # Health check endpoint
│   │   ├── 📁 services/
│   │   │   ├── 📄 auth_service.py  # User registration & login logic
│   │   │   └── 📄 llm_service.py   # Prompt improvement & intent detection
│   │   └── 📁 utils/
│   │       └── 📄 validators.py    # Input validation utilities
│   ├── 📄 config.py                # Environment configuration
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 run.py                   # Application entry point
│   └── 📄 Procfile                 # Render deployment config
│
├── 📁 frontend/                    # React Frontend
│   ├── 📁 src/
│   │   ├── 📄 App.js               # Main app with routing & auth
│   │   ├── 📄 index.js             # React entry point
│   │   ├── 📁 components/
│   │   │   ├── 📄 StartupScreen.js # Netflix-style loading screen
│   │   │   ├── 📄 Header.js        # Navigation bar
│   │   │   ├── 📄 Sidebar.js       # Side navigation
│   │   │   ├── 📄 ChatMessage.js   # Message bubble component
│   │   │   ├── 📄 ChatInput.js     # Message input field
│   │   │   └── 📄 LoadingSpinner.js # Loading indicator
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Home.js          # Main chat interface
│   │   │   ├── 📄 Login.js         # Login page
│   │   │   ├── 📄 Signup.js        # Registration page
│   │   │   ├── 📄 Profile.js       # User profile page
│   │   │   └── 📄 NotFound.js      # 404 error page
│   │   ├── 📁 contexts/
│   │   │   └── 📄 AuthContext.js   # Authentication context
│   │   └── 📁 services/
│   │       └── 📄 api.js           # Axios API client
│   ├── 📁 public/
│   │   ├── 📄 index.html
│   │   ├── 📄 manifest.json
│   │   └── 📄 robots.txt
│   └── 📄 package.json             # npm dependencies
│
├── 📄 README.md                    # You are here!
└── 📄 DEPLOYMENT.md                # Render deployment guide

```

### 🔄 Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant LLM (Gemini/Llama)
    participant MongoDB

    User->>Frontend: Enter prompt
    Frontend->>Frontend: Detect previous intent
    Frontend->>Backend: POST /api/llm/improve (with token)
    Backend->>Backend: Verify JWT token
    Backend->>Backend: Analyze intent
    Backend->>LLM (Gemini/Llama): Generate improved prompt
    LLM (Gemini/Llama)->>Backend: Return enhanced version
    Backend->>Frontend: Return improved prompt
    Frontend->>Frontend: Save to sessionStorage
    Frontend->>User: Display enhanced prompt
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** & npm
- **MongoDB Atlas** account (or local MongoDB)
- **Google AI API Key** (for Gemini)
- **Groq API Key** (for Llama 3)

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promptpilot.git
   cd promptpilot/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGO_DBNAME=promptpilot
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
   CORS_ORIGINS=http://localhost:3000
   GOOGLE_API_KEY=your-google-gemini-api-key
   GROQ_API_KEY=your-groq-api-key
   ```

5. **Run the server**
   ```bash
   python run.py
   ```
   
   Backend will start at `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   Frontend will open at `http://localhost:3000`

---

## 💻 Usage Guide

### 🎬 Getting Started

1. **Create an Account**
   - Navigate to `/signup` and register with email/password
   - You'll be automatically logged in after registration

2. **Start Improving Prompts**
   - Enter any prompt in the chat interface (minimum 10 characters)
   - PromptPilot will analyze intent and generate an improved version
   - View the enhanced prompt in the chat

3. **Edit & Regenerate**
   - Click the edit icon on any user message
   - Modify your prompt and save
   - AI will automatically regenerate the improved version

### 🎯 Example Use Cases

| Original Prompt | PromptPilot Enhancement | Intent Detected |
|----------------|-------------------------|-----------------|
| *"make a car image"* | Generates detailed image prompt with style, angle, lighting, quality parameters | **Image Generation** |
| *"write add function"* | Creates comprehensive coding requirements with language specification, edge cases, testing needs | **Coding** |
| *"explain quantum physics"* | Structures educational prompt with audience level, detail requirements, examples | **Q&A / Explanation** |
| *"thanks"* (after image prompt) | "You're welcome! If you want to generate images of other things, just type your prompt..." | **Context-Aware Response** |

### 🤖 Supported LLM Models

The system supports two AI models (configurable in backend):

- **Google Gemini 2.5 Flash** (default) - Fast, efficient, high-quality responses
- **Meta Llama 3.1 8B Instant** (via Groq) - Alternative model for prompt improvement

---

## 📚 API Documentation

### Base URL
```
Local: http://localhost:5000/api
Production: https://your-backend.onrender.com/api
```

### Authentication Endpoints

#### **POST** `/auth/signup`
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **POST** `/auth/login`
Authenticate user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### **GET** `/auth/me`
Get current user profile (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "email": "user@example.com",
  "id": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

### LLM Endpoints

#### **POST** `/llm/improve`
Improve a user prompt (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "make a sunset image",
  "model": "gemini",
  "previous_intent": "image_generation"
}
```

**Response:**
```json
{
  "improved_prompt": "Create a breathtaking high-resolution photograph of a sunset over the ocean. The scene should feature: vibrant orange, pink, and purple hues blending across the sky; golden hour lighting with sun positioned just above the horizon; gentle waves reflecting the colorful sky; silhouettes of clouds adding depth; photorealistic style with sharp details; wide-angle composition capturing the expansive vista; warm, serene atmosphere; professional photography quality with rich color saturation and dynamic range."
}
```

**Parameters:**
- `prompt` (required): User's original prompt to improve
- `model` (optional): AI model to use - `"gemini"` (default) or `"llama3"`
- `previous_intent` (optional): Context from previous message - `"coding"`, `"image_generation"`, `"video_generation"`, `"music"`, `"writing"`, or `"qa"`

### Health Check

#### **GET** `/health`
Check backend service status

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-29T10:30:00Z"
}
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.0 | UI framework with modern hooks |
| **React Router** | 7.5.3 | Client-side routing |
| **Axios** | 1.9.0 | HTTP client for API calls |
| **React Testing Library** | 16.3.0 | Component testing |
| **Web Vitals** | 2.1.4 | Performance monitoring |

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Flask** | 3.1.0 | Python web framework |
| **Flask-CORS** | 5.0.1 | Cross-origin resource sharing |
| **Flask-JWT-Extended** | 4.7.1 | JWT authentication |
| **Flask-PyMongo** | 3.0.1 | MongoDB integration |
| **Google Generative AI** | 0.8.5 | Gemini API client |
| **Groq** | 0.31.0 | Llama 3 API client |
| **Gunicorn** | 21.2.0 | Production WSGI server |
| **python-dotenv** | 1.1.0 | Environment configuration |

### Database & Cloud Services

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Google AI Studio** - Gemini API access
- **Groq Cloud** - Llama 3 API access
- **Render** - Deployment platform (optional)

---

## 🎨 Key Features in Detail

### 🧠 Intent Detection System

PromptPilot uses a sophisticated keyword-matching algorithm to detect user intent:

```python
# Automatically recognizes 6+ intent categories:
- Image Generation: "image", "photo", "picture", "draw", "render"
- Coding: "code", "function", "program", "api", "debug"
- Video Generation: "video", "animation", "movie", "clip"
- Music: "song", "melody", "beat", "tune"
- Writing: "poem", "story", "essay", "blog"
- Q&A: "explain", "what is", "how to", "why"
```

### 💬 Context-Aware Responses

When users send short acknowledgments like "thanks", "ok", or "cool", PromptPilot:
1. Retrieves the intent from the previous user prompt
2. Generates a contextual follow-up suggestion
3. Keeps the conversation flowing naturally

### 🔒 Security Features

- **JWT Authentication** with 24-hour token expiration
- **Password hashing** for secure credential storage
- **Token validation** on every protected endpoint
- **Automatic token refresh** handling in frontend
- **CORS configuration** for approved origins only

### 💾 Session Management

- **sessionStorage** preserves chat history during the browser session
- **Automatic cleanup** when users log out
- **No persistence** after tab/window closes for privacy

---

## 🌐 Deployment

For detailed deployment instructions on Render or other platforms, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Summary

**Backend (Render Web Service):**
```bash
Build Command: pip install -r requirements.txt
Start Command: gunicorn run:app
Root Directory: backend/
```

**Frontend (Render Static Site or Web Service):**
```bash
Build Command: npm install && npm run build
Publish Directory: build/
Root Directory: frontend/
```

---

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests
```bash
cd backend
pytest  # (if test suite is configured)
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- ✅ Verify MongoDB URI is correct
- ✅ Check API keys are set in `.env`
- ✅ Ensure virtual environment is activated

**Frontend can't connect:**
- ✅ Confirm backend is running on correct port
- ✅ Check `REACT_APP_API_BASE_URL` in frontend `.env`
- ✅ Verify CORS origins in backend config

**Authentication errors:**
- ✅ Clear localStorage and login again
- ✅ Check JWT_SECRET_KEY is consistent
- ✅ Verify token hasn't expired (24-hour limit)

**LLM not responding:**
- ✅ Validate Google/Groq API keys
- ✅ Check API quota/limits
- ✅ Review backend logs for errors

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **Google AI** for Gemini API
- **Meta & Groq** for Llama 3 access
- **MongoDB** for database infrastructure
- **React & Flask communities** for excellent documentation
- **Open source contributors** who inspire innovation

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/promptpilot?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/promptpilot?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/promptpilot)
![GitHub license](https://img.shields.io/github/license/yourusername/promptpilot)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ and AI**

</div>

## Deployment

- **Backend:** Deploy to [Render](https://render.com/) (free tier).
- **Frontend:** Deploy to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) (free tier).
- **MongoDB Atlas:** Used for cloud database.

---

## Example Use Cases

- **Prompt Engineering:**  
  Get suggestions for better prompts for AI models.
- **Image Generation:**  
  Improve prompts for generating creative images.
- **Coding Tasks:**  
  Refine coding task prompts for AI coding assistants.
- **LinkedIn Posts:**  
  Use improved prompts to generate engaging social media content.

---

## LinkedIn Post Example

> 🚀 Excited to share PromptPilot – my new AI-powered prompt improvement assistant!  
> ✨ It analyzes your prompts for coding, image generation, and more, then suggests improved versions tailored for your needs.  
> 💬 Features a modern chat UI, Netflix-style startup animation, and context-aware replies.  
> 🔗 Built with React, Flask, and MongoDB Atlas.  
> Try it out and level up your prompt engineering! #AI #PromptEngineering #React #Flask #MongoDB

---

## License

MIT

---

## Contact

For questions or collaboration, reach out via [LinkedIn](https://www.linkedin.com/) or open an issue!
