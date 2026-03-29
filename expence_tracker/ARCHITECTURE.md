# Financial Warner - System Architecture Documentation

**Version:** 1.0.0 | **Last Updated:** March 2026

---

## 🏗️ 1. SYSTEM OVERVIEW

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Voice Expense Input (Web Speech API)               │   │
│  │ • Manual Expense Entry Form                          │   │
│  │ • Dashboard with Budget Monitoring                   │   │
│  │ • Expense List & Deletion                            │   │
│  │ • Charts & Data Visualization (Recharts)             │   │
│  │ • Monthly/Yearly Reports                             │   │
│  │ • Loan/EMI Calculator                                │   │
│  │ • Settings (Budget Management)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ (Axios/REST API)
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ RESTful API Endpoints:                               │   │
│  │ • POST   /api/expenses/add (Add expense)             │   │
│  │ • GET    /api/expenses (Fetch all expenses)          │   │
│  │ • DELETE /api/expenses/:id (Delete expense)          │   │
│  │ • GET    /api/expenses/monthly-report (Monthly data) │   │
│  │ • POST   /api/budget/set (Set monthly budget)        │   │
│  │ • GET    /api/budget/current (Get current budget)    │   │
│  │ • GET    /api/expenses/export (CSV export)           │   │
│  │ • POST   /api/auth/register (User registration)      │   │
│  │ • POST   /api/auth/login (User authentication)       │   │
│  │ • GET    /api/analytics/spending-trends (Analytics) │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ (Mongoose ODM)
┌─────────────────────────────────────────────────────────────┐
│               DATABASE (MongoDB Atlas/Local)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Collections:                                         │   │
│  │ • Expenses (item, amount, category, date, userId)   │   │
│  │ • Budgets (monthlyLimit, userId, createdAt)         │   │
│  │ • Users (email, password, settings, theme)          │   │
│  │ • Notifications (alerts, warnings, userId)          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 2. DATA FLOW ARCHITECTURE

### Voice Expense Input Flow
```
[User Speaks] → [Web Speech API Recognizes] → [Process Text]
    ↓
[Extract Item & Amount] → [Validate Data] → [Send to Backend via POST]
    ↓
[Backend Receives] → [Create Expense Document] → [Store in MongoDB]
    ↓
[Return Response] → [Frontend Updates State] → [Re-render UI with new expense]
    ↓
[Display Confirmation] → [Update Charts & Budget Warning]
```

### Budget Monitoring Flow
```
[User Sets Monthly Budget] → [Store in MongoDB/LocalStorage]
    ↓
[Calculate Current Month Spending] → [Compare with Budget]
    ↓
[Determine Status]:
  • SAFE (0-80%) → Green indicator
  • WARNING (80-100%) → Orange indicator
  • CRITICAL (>100%) → Red indicator
    ↓
[Display Visual Progress Bar] → [Show Alert Message]
```

### Report Generation Flow
```
[Fetch All Expenses] → [Aggregate by Month] → [Calculate Monthly Totals]
    ↓
[Format CSV] → [Generate Report Header] → [Add Timestamps]
    ↓
[Send Response with Headers] → [Browser Downloads File]
```

---

## 🗄️ 3. DATABASE SCHEMA (MongoDB)

### Expense Collection
```javascript
{
  _id: ObjectId,
  userId: string (JWT user ID),
  item: string,
  amount: number,
  category: string (optional: Food, Transport, Entertainment, etc.),
  description: string (optional),
  paymentMethod: string (optional: Cash, Card, UPI),
  createdAt: Date (default: current timestamp),
  updatedAt: Date,
  tags: [string] (optional: for filtering)
}
```

### Budget Collection
```javascript
{
  _id: ObjectId,
  userId: string,
  monthlyLimit: number,
  alertThreshold: number (default: 80),
  currency: string (default: "INR"),
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection (with Authentication)
```javascript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed with bcrypt),
  name: string,
  theme: string (default: "light"),
  currency: string (default: "INR"),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  _id: ObjectId,
  userId: string,
  type: string (SAFE, WARNING, CRITICAL),
  message: string,
  spendingPercentage: number,
  createdAt: Date,
  isRead: boolean (default: false)
}
```

---

## 🔌 4. API ENDPOINTS SPECIFICATION

### Expense Endpoints

#### 1. Add Expense
```
POST /api/expenses/add
Content-Type: application/json

Request:
{
  "item": "Petrol",
  "amount": 500,
  "category": "Transport",
  "paymentMethod": "Cash"
}

Response (201):
{
  "success": true,
  "_id": "...",
  "item": "Petrol",
  "amount": 500,
  "createdAt": "2026-03-29T10:30:00Z"
}

Error (400):
{
  "success": false,
  "message": "Item and amount are required"
}
```

#### 2. Get All Expenses
```
GET /api/expenses?month=3&year=2026&category=Transport

Response (200):
{
  "success": true,
  "total": 5000,
  "count": 10,
  "data": [...]
}
```

#### 3. Delete Expense
```
DELETE /api/expenses/:id

Response (200):
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

#### 4. Monthly Report
```
GET /api/expenses/monthly-report?year=2026

Response (200):
{
  "success": true,
  "data": [
    { month: 1, total: 15000 },
    { month: 2, total: 18000 },
    { month: 3, total: 12500 }
  ]
}
```

#### 5. Export CSV
```
GET /api/expenses/export?month=3&year=2026

Response: (Downloads CSV file)
Financial Warner - Expense Report
Generated: 29-03-2026 10:30 AM

SN,Item,Amount (₹),Date,Time
1,Petrol,500,29-03-2026,10:30 AM
...
```

### Budget Endpoints

#### 1. Set Budget
```
POST /api/budget/set
{
  "monthlyLimit": 50000,
  "alertThreshold": 80
}

Response (201):
{
  "success": true,
  "monthlyLimit": 50000
}
```

#### 2. Get Current Budget
```
GET /api/budget/current

Response (200):
{
  "success": true,
  "monthlyLimit": 50000,
  "currentSpending": 32500,
  "percentage": 65,
  "status": "SAFE"
}
```

### Analytics Endpoints

#### 1. Spending Trends
```
GET /api/analytics/spending-trends?period=6months

Response (200):
{
  "success": true,
  "data": [
    { month: "Oct", amount: 15000 },
    { month: "Nov", amount: 18000 },
    { month: "Dec", amount: 25000 }
  ]
}
```

#### 2. Category Breakdown
```
GET /api/analytics/category-breakdown?month=3

Response (200):
{
  "success": true,
  "data": [
    { category: "Food", amount: 8000, percentage: 30 },
    { category: "Transport", amount: 5000, percentage: 18 },
    { category: "Entertainment", amount: 7500, percentage: 28 }
  ]
}
```

### Authentication Endpoints

#### 1. Register
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "user@example.com" }
}
```

#### 2. Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "user@example.com" }
}
```

---

## 🔐 5. SECURITY ARCHITECTURE

### Frontend Security
- **CORS Configuration**: Only allow requests from authenticated frontend domain
- **Input Validation**: Sanitize all user inputs (item name, amount)
- **LocalStorage**: Store JWT token securely
- **HTTPS Only**: Enforce HTTPS in production
- **XSS Prevention**: React automatically escapes JSX

### Backend Security
- **JWT Authentication**: Protect endpoints with bearer tokens
- **Password Hashing**: Use bcrypt with salt rounds = 10
- **Validation Middleware**: Validate request body and parameters
- **Rate Limiting**: Prevent brute force attacks (e.g., 100 requests/15min per IP)
- **Error Handling**: Don't expose sensitive error details to frontend
- **CORS Middleware**: Whitelist only production frontend domains
- **Helmet.js**: Set secure HTTP headers
- **Express-Validator**: Comprehensive request validation

### Database Security
- **Connection String**: Use environment variables (MongoDB Atlas URI)
- **Credentials**: Store in .env file (never commit)
- **Database Authentication**: Enable MongoDB user authentication
- **IP Whitelist**: In MongoDB Atlas, allow only server IP
- **Backups**: Enable automated backups in MongoDB Atlas

---

## 🚀 6. DEPLOYMENT ARCHITECTURE

### Frontend Deployment (Vercel/Netlify)
```
Step 1: Build React app (npm run build)
         ↓
Step 2: Upload build folder to Vercel
         ↓
Step 3: Configure environment variables (API_URL)
         ↓
Step 4: Enable auto-deployment from GitHub
         ↓
Result: App available at https://financial-warner.vercel.app
```

### Backend Deployment (Render/Railway)
```
Step 1: Push code to GitHub
         ↓
Step 2: Connect GitHub repo to Render.com
         ↓
Step 3: Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
         ↓
Step 4: Enable auto-deploy on push
         ↓
Result: API available at https://financial-warner-backend.render.com
```

### Database Deployment (MongoDB Atlas)
```
Step 1: Create MongoDB Atlas cluster (M0 free tier)
         ↓
Step 2: Create database user and password
         ↓
Step 3: Configure network access (IP whitelist)
         ↓
Step 4: Get connection string
         ↓
Step 5: Set MONGODB_URI in backend .env
         ↓
Result: Cloud database ready
```

---

## 🔄 7. TECHNOLOGY STACK DETAILS

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **Frontend** | React | UI library | 18.x |
| | React Router | Navigation | 6.x |
| | Axios | HTTP client | 1.x |
| | Recharts | Data visualization | 2.x |
| | CSS3 | Styling | - |
| **Backend** | Node.js | Runtime | 18.x+ |
| | Express.js | Web framework | 4.x |
| | Mongoose | ODM | 7.x |
| | JWT | Authentication | - |
| | Bcrypt | Password hashing | 5.x |
| | json2csv | CSV export | 6.x |
| **Database** | MongoDB | NoSQL database | 6.x |
| | MongoDB Atlas | Cloud hosting | - |
| **DevOps** | Git | Version control | - |
| | GitHub | Repository | - |
| | Vercel | Frontend hosting | - |
| | Render | Backend hosting | - |

---

## 📈 8. SCALABILITY CONSIDERATIONS

### Current Capacity
- **Users**: ~100 concurrent users (single free tier instance)
- **Requests**: ~1000 requests/min
- **Storage**: 512MB (MongoDB Atlas M0)

### Scaling Strategy
- **Database**: Upgrade to M1/M2 tier → Enable replication → Add indexes
- **Backend**: Upgrade Render plan → Add caching (Redis) → Implement job queues
- **Frontend**: CDN caching → Code splitting → Image optimization
- **Load Balancing**: Implement behind reverse proxy (nginx)

---

## 🧪 9. TESTING STRATEGY

### Frontend Testing
- Unit Tests: Jest + React Testing Library
- E2E Tests: Cypress
- Performance: Lighthouse

### Backend Testing
- Unit Tests: Jest
- Integration Tests: Supertest + Jest
- API Testing: Postman/Insomnia

---

## 📚 10. MONITORING & LOGGING

### Frontend Monitoring
- Error tracking: Sentry
- Performance: Web Vitals
- User analytics: Google Analytics

### Backend Monitoring
- Logs: Winston logger
- Error tracking: Sentry
- Performance: New Relic

---

## 🔄 11. CI/CD PIPELINE

```
Step 1: Developer pushes to GitHub
         ↓
Step 2: GitHub Actions runs tests
         ↓
Step 3: If tests pass → Deploy to staging
         ↓
Step 4: Manual approval
         ↓
Step 5: Deploy to production
         ↓
Step 6: Smoke tests on production
```

---

## 📱 12. COMPONENT ARCHITECTURE

### Frontend Components Hierarchy
```
App
├── Header
├── Navigation (Dashboard / Settings)
├── Dashboard
│   ├── BudgetWarning
│   ├── VoiceExpense
│   ├── AddExpense
│   ├── ExpenseList
│   ├── ExpenseChart
│   │   ├── BarChart (Monthly trends)
│   │   └── PieChart (Category breakdown)
│   ├── LoanCalculator
│   ├── Reports
│   └── Analytics
└── Settings
    ├── BudgetSetting
    ├── ThemeSetting
    └── NotificationSetting
```

### Backend Route Structure
```
/api
├── /expenses
│   ├── POST /add
│   ├── GET /
│   ├── DELETE /:id
│   ├── GET /monthly-report
│   └── GET /export
├── /budget
│   ├── POST /set
│   └── GET /current
├── /analytics
│   ├── GET /spending-trends
│   └── GET /category-breakdown
└── /auth
    ├── POST /register
    └── POST /login
```

---

## ✅11. PRODUCTION CHECKLIST

- [ ] Environment variables configured for all services
- [ ] MongoDB Atlas cluster created and secured
- [ ] JWT secret key generated and secured
- [ ] Frontend API URL points to production backend
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled on backend
- [ ] Error logging configured (Sentry)
- [ ] Database backups enabled
- [ ] SSL certificates configured
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Documentation complete
- [ ] User manual created

---

This architecture is production-ready, scalable, and follows industry best practices. Next, I'll implement all components with professional code quality.
