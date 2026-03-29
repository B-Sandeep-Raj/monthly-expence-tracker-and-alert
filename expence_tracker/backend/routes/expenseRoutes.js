/**
 * Expense Routes
 * Handles all expense-related API endpoints
 */

const router = require("express").Router()
const expenseController = require("../controllers/expenseController")

// ============================================
// MAIN ROUTES
// ============================================

// Add new expense
router.post("/add", expenseController.addExpense)

// Get all expenses (with filtering and pagination)
router.get("/", expenseController.getExpenses)

// ============================================
// REPORT & ANALYTICS ROUTES (must come before /:id)
// ============================================

// Get monthly report
router.get("/monthly-report", expenseController.getMonthlyReport)

// Get category breakdown
router.get("/analytics/categories", expenseController.getCategoryBreakdown)

// Export to CSV
router.get("/export/csv", expenseController.exportToCSV)

// Get recurring expenses
router.get("/recurring", expenseController.getRecurringExpenses)

// Process monthly recurring expenses (generates copies for the next month)
router.post("/recurring/process", expenseController.processMonthlyRecurring)

// ============================================
// DYNAMIC ROUTES (/:id must come last)
// ============================================

// Get single expense by ID
router.get("/:id", expenseController.getExpenseById)

// Update expense
router.put("/:id", expenseController.updateExpense)

// Delete expense
router.delete("/:id", expenseController.deleteExpense)

module.exports = router