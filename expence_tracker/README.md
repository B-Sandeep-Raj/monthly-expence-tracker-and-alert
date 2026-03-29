# ⚠️ Financial Warner - Voice Expense Recorder

> **A Production-Ready MERN Stack Application for Personal Finance Management**

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange)](package.json)
[![Node](https://img.shields.io/badge/node-14+-success)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.0+-green)](https://www.mongodb.com/)

---

## 🎯 Quick Overview

Financial Warner is a comprehensive expense tracking application that combines modern web technologies with practical financial management features. Track your spending effortlessly using voice commands, monitor your budget in real-time, visualize your expenses with beautiful charts, and generate professional reports.

**Key Highlights:**
- 🎤 **Voice Input**: "Petrol 500" - that's it!
- 💰 **Budget Monitoring**: Real-time alerts (SAFE/WARNING/CRITICAL)
- 📊 **Beautiful Charts**: Interactive visualizations with Recharts
- 📄 **Professional Reports**: CSV export with formatting
- 🚀 **Production Ready**: Full deployment guides included
- 📱 **Responsive Design**: Works on all devices

---

## 🚀 Getting Started (5 Minutes)

### Prerequisites
- Node.js 14+ (https://nodejs.org/)
- MongoDB (local or cloud)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/financial-warner.git
cd expence_tracker

# Backend setup
cd backend
cp .env.example .env
# Edit .env with your MongoDB URL
npm install
npm run dev  # Runs on http://localhost:5000

# Frontend setup (new terminal)
cd ../frontend
npm install
npm start    # Opens http://localhost:3000
```

That's it! 🎉

---

## 📚 Documentation

Choose your path based on what you need:

### 📖 **New to the Project?**
Start here: **[PROJECT_README.md](PROJECT_README.md)**
- Complete feature overview
- Installation instructions
- API documentation  
- Troubleshooting guide
- 25+ interview questions with answers

### 🏗️ **Want to Understand Architecture?**
Read: **[ARCHITECTURE.md](ARCHITECTURE.md)**
- System design with diagrams
- Data flow explanations
- Database schema details
- API specifications
- Scalability considerations

### 🌐 **Ready to Deploy?**
Follow: **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
- Local development setup
- MongoDB Atlas configuration
- Deploy to Render (backend)
- Deploy to Vercel (frontend)
- Docker setup
- Performance optimization

### 🎓 **Preparing for Viva/Interview?**
Study: **[VIVA_GUIDE.md](VIVA_GUIDE.md)**
- 15+ technical interview questions
- Architecture deep dives
- Real-world coding scenarios
- Security implementation
- Scaling strategies
- Interview tips

### ✅ **What's Built?**
Check: **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)**
- Project statistics
- Features checklist
- File inventory
- Code metrics
- Future enhancements

---

## ✨ Features

### Core Features ✅
- **Voice Expense Input** - Use Web Speech API to record expenses by speaking
- **Manual Entry** - Form-based expense entry with categories
- **Real-time Budget Monitoring** - See your budget status instantly
- **Expense Management** - View, filter, sort, and delete expenses
- **Financial Calculations** - Loan/EMI calculator with interest computation

### Advanced Features ✅
- **Data Visualization** - Bar charts, pie charts, line charts
- **Spending Analytics** - Trends, category breakdown, insights
- **Report Generation** - CSV/JSON export with professional formatting
- **Monthly Summaries** - Detailed month-by-month breakdowns
- **Responsive Design** - Works on desktop, tablet, mobile

### Alert System ✅
```
🟢 SAFE (0-80%)        → Keep spending normally
🟠 WARNING (80-100%)   → Reduce spending
🔴 CRITICAL (>100%)    → You've exceeded budget
```

---

## 🛠 Tech Stack

### Frontend
```
React 18.2       - UI library
Recharts 2.10    - Data visualization
Axios 1.6        - HTTP client
CSS3             - Styling
```

### Backend
```
Node.js 14+      - Runtime
Express 4.18     - Web framework
MongoDB 6.0      - Database
Mongoose 7.5     - ODM
JSON2CSV 6.0     - CSV export
```

### DevOps
```
MongoDB Atlas    - Cloud database
Render.com       - Backend hosting
Vercel           - Frontend hosting
GitHub Actions   - CI/CD
```

---

## 📁 Project Structure

```
expence_tracker/
├── backend/                          # Node.js + Express API
│   ├── controllers/                  # Business logic
│   ├── models/                       # MongoDB schemas
│   ├── routes/                       # API endpoints
│   ├── utils/                        # Helpers & validation
│   ├── server.js                     # Main server file
│   └── package.json
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── App.js                    # Main component
│   │   └── App.css                   # Styling
│   └── package.json
│
└── Documentation/
    ├── PROJECT_README.md             # Complete guide
    ├── ARCHITECTURE.md               # System design
    ├── DEPLOYMENT_GUIDE.md           # How to deploy
    ├── VIVA_GUIDE.md                 # Interview prep
    └── COMPLETION_SUMMARY.md         # What's built
```

---

## 🎬 Usage Example

### Adding an Expense via Voice

```
1. Click "🎤 Start Speaking"
2. Say: "Coffee 150"
3. Expense automatically recorded ✅
4. Budget status updated 📊
5. Charts refresh 📈
```

### Adding an Expense Manually

```
1. Fill in expense form
   - Item: Coffee
   - Amount: 150
   - Category: Food
   - Payment: Cash
2. Click "➕ Add Expense"
3. Expense saved ✅
```

### Checking Your Budget

```
1. Go to Dashboard
2. See BudgetWarning component
3. Shows: Spent, Remaining, Percentage
4. Color changes based on 3 levels
5. Get motivated to spend wisely! 💪
```

---

## 📡 API Endpoints

### Expenses
```
POST   /api/expenses/add              Add new expense
GET    /api/expenses                  Get all expenses
GET    /api/expenses/:id              Get single expense
PUT    /api/expenses/:id              Update expense
DELETE /api/expenses/:id              Delete expense
GET    /api/expenses/export/csv       Download CSV
```

### Budget
```
POST   /api/budget/set                Set budget limit
GET    /api/budget/current            Get current status
```

### Analytics  
```
GET    /api/analytics/spending-trends  Spending trends
GET    /api/analytics/categories        Category breakdown
GET    /api/analytics/dashboard         Dashboard data
```

[Full API Documentation →](PROJECT_README.md#-api-documentation)

---

## 🚀 Deployment

### Local Development
```bash
cd backend && npm run dev  # Terminal 1
cd frontend && npm start   # Terminal 2
```

### Production (Cloud)

**Backend** (Render):
1. Connect GitHub repo
2. Set environment variables
3. Deploy

**Frontend** (Vercel):
1. Connect GitHub repo
2. Set API URL
3. Deploy

[Detailed Deployment Guide →](DEPLOYMENT_GUIDE.md)

---

## 🔐 Security Features

- ✅ Input validation
- ✅ Error sanitization
- ✅ CORS configuration
- ✅ Rate limiting ready
- ✅ MongoDB injection prevention
- ✅ Environment variables for secrets
- ✅ Secure response headers

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| API Endpoints | 15+ |
| Components | 8+ |
| Collections | 3+ |
| Features | 12+ |
| Code Lines | 5000+ |
| Documentation | 11000+ words |
| Status | Production Ready ✅ |

---

## 🎓 Learning Value

This project demonstrates:
- ✅ Full-stack development
- ✅ REST API design
- ✅ Database optimization
- ✅ Modern React patterns
- ✅ Error handling
- ✅ Deployment strategies
- ✅ System architecture
- ✅ Code organization

Perfect for portfolio and interviews! 🎯

---

## ❓ FAQ

**Q: Can I use this without MongoDB locally?**  
A: Yes, use MongoDB Atlas (free M0 tier). Update `.env` with connection string.

**Q: Does voice work in all browsers?**  
A: Chrome, Firefox, Safari, Edge all support it. Mobile browsers vary.

**Q: How do I deploy this?**  
A: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

**Q: Can I add authentication?**  
A: Yes! See [VIVA_GUIDE.md](VIVA_GUIDE.md#q13-handling-concurrent-updates) for implementation guidance.

**Q: Is this suitable for a final year project?**  
A: Absolutely! It's production-ready and includes comprehensive documentation.

---

## 🤝 Contributing

Want to improve this project?

```bash
# Fork the repository
# Create a branch: git checkout -b feature/amazing-feature
# Make changes and commit: git commit -m 'Add amazing feature'
# Push: git push origin feature/amazing-feature
# Submit a pull request
```

---

## 📞 Support

- **Issues**: Create GitHub issue
- **Questions**: Check [PROJECT_README.md](PROJECT_README.md#-troubleshooting)
- **Deployment Help**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Interview Prep**: Read [VIVA_GUIDE.md](VIVA_GUIDE.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Web Speech API Documentation
- React & Recharts Communities
- MongoDB Documentation
- Express.js Best Practices

---

## 👨‍💻 Author

**Created**: March 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

## 📈 Roadmap

### ✅ Completed (v1.0)
- Voice expense input
- Budget monitoring
- Charts & visualization
- CSV export
- API endpoints
- Documentation

### 🔄 Planned (v2.0)
- User authentication
- Multi-user support
- Receipt image upload
- Mobile app
- Dark mode
- Email notifications

### 🚀 Future (v3.0)
- AI predictions
- Bank API integration
- Cryptocurrency tracking
- Advanced analytics

---

## 🎉 Quick Start Commands

```bash
# Clone
git clone https://github.com/yourusername/financial-warner.git
cd expence_tracker

# Install backend
cd backend && npm install && cp .env.example .env

# Install frontend
cd ../frontend && npm install

# Run backend
cd ../backend && npm run dev

# Run frontend (new terminal)
cd frontend && npm start

# Open browser
# http://localhost:3000
```

---

**Let's track and manage finances better! 💰📊**

---

<div align="center">

**[Installation Guide](PROJECT_README.md) • [Architecture](ARCHITECTURE.md) • [Deployment](DEPLOYMENT_GUIDE.md) • [Interview Q&A](VIVA_GUIDE.md)**

⭐ If this helps you, please give it a star! ⭐

</div>


Financial Warner is an intelligent expense tracking system that combines **voice recognition**, **budget monitoring**, and **financial analytics** to help you manage your personal finances effectively. Unlike traditional expense apps that just show numbers, Financial Warner actively warns you about your spending and helps you maintain control of your budget.

---

## ✨ Core Features

### 🎤 Voice-Activated Expense Entry
- Speak naturally: "Petrol 500" or "Groceries 800"
- Advanced speech recognition with auto-stop
- Automatic data extraction
- Instant feedback and confirmation
- Indian English accent support

### ⚠️ Real-Time Budget Warnings
- Set custom monthly budget
- Visual progress bar
- Three-level alerts:
  - 🟢 **SAFE** (0-80%)
  - 🟠 **WARNING** (80-100%)
  - 🔴 **CRITICAL** (>100%)
- Remaining balance calculation
- Live status display

### 📝 Manual Expense Entry
- Easy form-based entry
- Quick add functionality
- Input validation
- Instant updates

### 📋 Expense Management
- View all expenses with timestamps
- Delete individual items
- Real-time totals
- Clean organized interface
- Sortable entries

### 📈 Visual Analytics
- Bar charts showing breakdown
- Monthly spending trends
- Year-to-date summaries
- Interactive graphs
- Pattern analysis

### 📊 Monthly Reports
- Automatic monthly summaries
- Spending by month
- Professional interface
- Export-ready data

### 📄 Professional Data Export

**CSV Export Includes:**
- Serial numbers
- Item names
- Amount in ₹
- Date (DD-MM-YYYY)
- Time (12-hour format)
- Automatic total row
- Professional headers

**Example CSV Output:**