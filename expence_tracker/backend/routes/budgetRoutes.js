/**
 * Budget Routes
 * Handles all budget-related API endpoints
 */

const router = require("express").Router()
const budgetController = require("../controllers/budgetController")

// ============================================
// BUDGET ROUTES
// ============================================

// Set or update monthly budget
router.post("/set", budgetController.setBudget)

// Get current month's budget status
router.get("/current", budgetController.getCurrentBudget)

// Get budget for specific month
router.get("/:month/:year", budgetController.getBudgetByMonth)

// Delete budget
router.delete("/", budgetController.deleteBudget)

module.exports = router
