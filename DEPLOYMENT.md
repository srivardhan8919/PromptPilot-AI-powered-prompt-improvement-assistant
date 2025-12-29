# Deployment Guide for Render

## 🚀 Backend Deployment (Render)

### Step 1: Create Backend Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `backend` folder as the root directory

### Step 2: Configure Backend Settings

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn run:app
```

**Environment Variables (Backend):**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGO_DBNAME=promptpilot
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGINS=https://your-frontend-url.onrender.com,https://your-frontend-domain.com
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key
```

**Important Notes:**
- Render will automatically set the `PORT` environment variable
- Your backend URL will be: `https://your-backend-name.onrender.com`
- Make sure to add your frontend URL to `CORS_ORIGINS`

---

## 🎨 Frontend Deployment (Render)

### Step 1: Create Frontend Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"** (or Web Service for React)
3. Connect your GitHub repository
4. Select the `frontend` folder as the root directory

### Step 2: Configure Frontend Settings

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
build
```

**Environment Variables (Frontend):**
```
REACT_APP_API_BASE_URL=https://your-backend-name.onrender.com
```

**Important Notes:**
- Replace `your-backend-name` with your actual backend service name
- Frontend URL will be: `https://your-frontend-name.onrender.com`
- Make sure to add this URL to backend's `CORS_ORIGINS`

---

## 🔗 Connecting Backend with Frontend

### Environment Variables Summary

**Backend (.env or Render Environment Variables):**
```env
MONGO_URI=your_mongodb_connection_string
MONGO_DBNAME=promptpilot
JWT_SECRET_KEY=your-secret-key-min-32-characters
CORS_ORIGINS=https://your-frontend.onrender.com
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key
```

**Frontend (Render Environment Variables):**
```env
REACT_APP_API_BASE_URL=https://your-backend.onrender.com
```

### Example URLs:

If your backend is named `promptpilot-backend`:
- Backend URL: `https://promptpilot-backend.onrender.com`
- Frontend should use: `REACT_APP_API_BASE_URL=https://promptpilot-backend.onrender.com`

If your frontend is named `promptpilot-frontend`:
- Frontend URL: `https://promptpilot-frontend.onrender.com`
- Backend CORS_ORIGINS should include: `https://promptpilot-frontend.onrender.com`

---

## ✅ Pre-Deployment Checklist

### Backend:
- [x] Procfile created
- [x] requirements.txt includes gunicorn
- [x] run.py configured for production
- [x] Environment variables ready
- [x] MongoDB Atlas cluster created
- [x] CORS configured correctly

### Frontend:
- [x] Environment variables configured
- [x] API endpoints use environment variables
- [x] Build command works locally (`npm run build`)

---

## 🧪 Testing After Deployment

1. **Test Backend Health:**
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status": "ok"}`

2. **Test Frontend:**
   - Open your frontend URL
   - Startup screen should check backend health
   - Try signing up/logging in
   - Test prompt improvement feature

---

## 🔧 Troubleshooting

### Backend Issues:
- **503 Error**: Check if MongoDB URI is correct
- **CORS Error**: Verify frontend URL is in `CORS_ORIGINS`
- **Port Error**: Render sets PORT automatically, don't hardcode it

### Frontend Issues:
- **API Connection Failed**: Check `REACT_APP_API_BASE_URL` is correct
- **Build Failed**: Run `npm run build` locally first to check for errors
- **Environment Variables Not Working**: Make sure they start with `REACT_APP_`

---

## 📝 Notes

- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on service
- MongoDB Atlas free tier is perfect for this project

