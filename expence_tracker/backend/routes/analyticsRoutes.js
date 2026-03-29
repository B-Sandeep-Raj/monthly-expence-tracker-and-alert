/**
 * Analytics Routes
 * Handles all analytics and insights-related API endpoints
 */

const router = require("express").Router()
const analyticsController = require("../controllers/analyticsController")

// ============================================
// ANALYTICS ROUTES
// ============================================

// Get spending trends over time
router.get("/spending-trends", analyticsController.getSpendingTrends)

// Get category-wise analytics
router.get("/categories", analyticsController.getCategoryAnalytics)

// Get payment method analytics
router.get("/payment-methods", analyticsController.getPaymentMethodAnalytics)

// Get comprehensive dashboard summary
router.get("/dashboard", analyticsController.getDashboardSummary)

module.exports = router
