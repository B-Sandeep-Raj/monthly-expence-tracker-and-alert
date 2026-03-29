# Deployment & Setup Guide - Financial Warner

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 14+ & npm
- MongoDB (local) or MongoDB Atlas account
- Git

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/financial-warner.git
cd expence_tracker

# 2. Setup Backend
cd backend
cp .env.example .env
# Edit .env with your settings
npm install
npm run dev

# 3. Setup Frontend (New Terminal)
cd ../frontend
npm install
npm start

# 4. Open http://localhost:3000 in browser
```

---

## ☁️ Production Deployment

### Step 1: MongoDB Atlas Setup

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: 
   - Choose Free M0 tier
   - Provider: AWS/Google Cloud
   - Region: Your closest region
3. **Create Database User**:
   - Go to Database Access
   - Add New User (username/password)
   - Role: "Read and write to any database"
4. **IP Whitelist**:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow all) or specific IPs
5. **Get Connection String**:
   - Click "Connect" on cluster
   - Copy connection string like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/voiceExpenseDB
   ```

### Step 2: Deploy Backend (Render)

1. **Prepare GitHub**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/financial-warner.git
   git push -u origin main
   ```

2. **Setup Render**:
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → Web Service
   - Connect GitHub repo (backend folder)
   - Settings:
     - **Name**: financial-warner-backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Runtime**: Node
     - **Plan**: Free (0.50 CPU, 512 MB RAM)

3. **Environment Variables** (on Render):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voiceExpenseDB
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://financial-warner.vercel.app
   JWT_SECRET=generate-a-random-string-here
   LOG_LEVEL=info
   ```

4. **Deploy**: Click "Deploy"
   - Get backend URL: `https://financial-warner-backend.onrender.com`

### Step 3: Deploy Frontend (Vercel)

1. **Prepare Repository**:
   ```bash
   cd frontend
   # Make sure code is committed to GitHub
   git push origin main
   ```

2. **Setup Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Select frontend folder
   - configure:
     - **Framework**: React
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Environment Variables** (on Vercel):
   ```
   REACT_APP_API_URL=https://financial-warner-backend.onrender.com/api
   ```

4. **Deploy**: Click "Deploy"
   - Get frontend URL: `https://financial-warner.vercel.app`

5. **Update Backend CORS**:
   - Go back to Render
   - Update `FRONTEND_URL` to Vercel URL
   - Trigger redeploy

---

## 📋 Production Deployment Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Remove console.logs
- [ ] Update API URLs to production
- [ ] Verify environment variables
- [ ] Check security headers
- [ ] Enable rate limiting
- [ ] Setup error tracking (Sentry)
- [ ] Configure backups
- [ ] Add SSL certificate

### After Deployment
- [ ] Test all features on production
- [ ] Verify API endpoints
- [ ] Check database connectivity
- [ ] Monitor error logs
- [ ] Setup monitoring alerts
- [ ] Test user workflows
- [ ] Verify CORS configuration
- [ ] Check performance metrics

### Monitoring Setup

**Sentry (Error Tracking)**:
```javascript
// backend/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

**New Relic (Performance)**:
```javascript
// backend/server.js (first line)
require('newrelic');
```

---

## 🔐 Production Security Checklist

### Backend Security
```javascript
// Helmet for secure headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS whitelist
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}));

// Password hashing
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```

### Database Security
- ✅ Modify connection string: Change default username/password
- ✅ Enable authentication on MongoDB
- ✅ Restrict IP addresses in MongoDB Atlas
- ✅ Enable encryption at rest
- ✅ Setup automated backups
- ✅ Monitor access logs

### Frontend Security
- ✅ Use HTTPS only
- ✅ Implement CSP headers
- ✅ Validate all inputs
- ✅ Use secure HTTP-only cookies (for auth)
- ✅ Sanitize data from API
- ✅ Implement CSRF protection if using forms

---

## 📊 Monitoring & Analytics

### Key Metrics to Monitor

1. **Backend**:
   - API response time
   - Error rate
   - Database query performance
   - Uptime/Availability

2. **Frontend**:
   - Page load time
   - User interactions
   - Error rate
   - Browser compatibility

3. **Database**:
   - Query execution time
   - Storage usage
   - Connection count
   - Backup status

### Setup Google Analytics (Frontend)

```bash
# Install
npm install react-ga4

# In App.js
import ReactGA from 'react-ga4';

useEffect(() => {
  ReactGA.initialize(process.env.REACT_APP_GA_ID);
  ReactGA.send("pageview");
}, []);
```

### Setup DataDog Monitoring

```bash
# Backend
npm install @datadog/browser-rum

# Configure in backend
const dogstatsd = require('node-dogstatsd').StatsD;
const client = new dogstatsd();
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      
      - name: Install backend
        run: cd backend && npm install
      
      - name: Test backend
        run: cd backend && npm test
      
      - name: Install frontend
        run: cd frontend && npm install
      
      - name: Build frontend
        run: cd frontend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        env:
          RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
        run: curl "$RENDER_DEPLOY_HOOK"
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token="$VERCEL_TOKEN"
```

---

## 🐳 Docker Deployment (Optional)

### Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    depends_on:
      - mongodb
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/voiceExpenseDB
      PORT: 5000
      NODE_ENV: production

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://backend:5000/api

volumes:
  mongo_data:
```

### Deploy with Docker:
```bash
docker-compose up --build -d
# Stop: docker-compose down
```

---

## 🎯 Performance Optimization

### Backend Optimization

```javascript
// Add caching
const redis = require('redis');
const client = redis.createClient();

// Cache budget data (10 minute TTL)
router.get('/budget/current', async (req, res) => {
  const cached = await client.get('budget_' + userId);
  if (cached) return res.json(JSON.parse(cached));
  
  // Fetch from DB
  const budget = await Budget.findOne({ userId });
  await client.setex('budget_' + userId, 600, JSON.stringify(budget));
  res.json(budget);
});

// Database indexes
ExpenseSchema.index({ userId: 1, createdAt: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
```

### Frontend Optimization

```javascript
// Code splitting
const Analytics = React.lazy(() => import('./components/Analytics'));

// Lazy loading images
<img src={imageSrc} loading="lazy" />

// Memoization
const MemoizedChart = React.memo(ExpenseChart);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
```

---

## 📞 Support & Troubleshooting

### Common Deployment Issues

**Issue**: Render keeps restarting app
```
Solution: Check for infinite loops or memory leaks
- Review logs on Render dashboard
- Check MongoDB connection
- Verify environment variables
```

**Issue**: CORS error in production
```
Solution: Update FRONTEND_URL
- In Render backend settings
- Change FRONTEND_URL to Vercel URL
- Restart service
```

**Issue**: MongoDB connection timeout
```
Solution: IP whitelist issue
- Go to MongoDB Atlas
- Check Network Access
- Add Render server IP
- Or add 0.0.0.0/0 temporarily for debugging
```

**Issue**: Frontend can't connect to backend
```
Solution: Check API URL
- Verify REACT_APP_API_URL in Vercel
- Ensure backend URL is accessible
- Check CORS configuration
- Test with curl: curl https://backend-url/api/health
```

---

## 📈 Scaling Guidelines

### When to Scale

- **Database**: > 1GB data → Upgrade MongoDB tier
- **Backend**: > 80% CPU → Add another instance
- **Frontend**: > 5MB bundle → Implement code splitting
- **Requests**: > 1000/min → Add load balancer

### Scaling Steps

1. **Database**: Upgrade from M0 → M1 → M2
2. **Backend**: Add horizontal scaling with Render
3. **Cache**: Implement Redis
4. **CDN**: Add Cloudflare or AWS CloudFront
5. **Load Balancer**: Nginx or AWS ALB

---

## Useful Commands

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check MongoDB connection
mongo "mongodb://127.0.0.1:27017"

# View backend logs (Render)
render logs financial-warner-backend

# View frontend logs (Vercel)
vercel logs financial-warner

# Test API endpoint
curl -X GET http://localhost:5000/api/expenses

# Build for production
cd frontend && npm run build

# View build stats
npm install --save-dev source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

---

## 🎓 Learning Resources

- Express.js Docs: https://expressjs.com/
- MongoDB Documentation: https://docs.mongodb.com/
- React Documentation: https://react.dev/
- Render Deployment: https://render.com/docs
- Vercel Deployment: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Last Updated**: March 2026 | Maintained by: Your Name
