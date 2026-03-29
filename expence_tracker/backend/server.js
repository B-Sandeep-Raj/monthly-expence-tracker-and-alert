/**
 * Financial Warner - Backend Server
 * Express.js server with MongoDB integration
 * Handles all expense tracking, budget monitoring, and report generation
 */

require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

// ====================
// MIDDLEWARE SETUP
// ====================

// CORS Configuration - Allow frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Logging middleware (shows all HTTP requests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"))
}

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000)
  next()
})

// ====================
// DATABASE SETUP
// ====================

/**
 * Connect to MongoDB
 * Supports both local and MongoDB Atlas connections
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/voiceExpenseDB"
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log("✅ MongoDB connected successfully")
    console.log(`📦 Database: ${mongoose.connection.name}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    // Retry connection after 5 seconds
    setTimeout(() => connectDB(), 5000)
  }
}

// ====================
// ROUTE IMPORTS
// ====================

const expenseRoutes = require("./routes/expenseRoutes")
const budgetRoutes = require("./routes/budgetRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")

// ====================
// ROUTES
// ====================

app.use("/api/expenses", expenseRoutes)
app.use("/api/budget", budgetRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// ====================
// 404 HANDLER
// ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  })
})

// ====================
// ERROR HANDLING MIDDLEWARE
// ====================

app.use((err, req, res, next) => {
  console.error("❌ Error:", err)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map(e => e.message)
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered"
    })
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  })
})

// ====================
// SERVER STARTUP
// ====================

const PORT = process.env.PORT || 5000

/**
 * Start server after database connection
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║  ⚠️  Financial Warner - Backend Server     ║
║                                            ║
║  🚀 Server running on port ${PORT}        ║
║  📍 URL: http://localhost:${PORT}         ║
║  🌍 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"} ║
║  📊 Dashboard: /api/expenses               ║
║  💰 Budget: /api/budget                    ║
║  📈 Analytics: /api/analytics              ║
║                                            ║
╚════════════════════════════════════════════╝
    `)
  })
})

// Handle server errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err)
  process.exit(1)
})

module.exports = app