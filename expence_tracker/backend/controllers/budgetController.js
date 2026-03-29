/**
 * Budget Controller
 * Handles all business logic for budget operations
 */

const Budget = require("../models/Budget")
const Expense = require("../models/Expense")
const { validateBudget } = require("../utils/validation")
const { NotFoundError } = require("../utils/errors")

// ============================================
// Set Monthly Budget
// ============================================
/**
 * POST /api/budget/set
 * Create or update monthly budget
 * 
 * Request body:
 * {
 *   monthlyLimit: number,
 *   alertThreshold?: number (0-100, default: 80)
 *   currency?: string
 * }
 */
exports.setBudget = async (req, res, next) => {
  try {
    const { monthlyLimit, alertThreshold, currency } = req.body
    const userId = "default_user"  // In production, use req.user.id

    // Validate input
    const validation = validateBudget({ monthlyLimit, alertThreshold })
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      })
    }

    // Find or create budget
    let budget = await Budget.findOne({ userId })

    if (budget) {
      // Update existing budget
      budget.monthlyLimit = monthlyLimit
      budget.alertThreshold = alertThreshold || budget.alertThreshold
      budget.currency = currency || budget.currency
      await budget.save()
    } else {
      // Create new budget
      budget = new Budget({
        userId,
        monthlyLimit,
        alertThreshold: alertThreshold || 80,
        currency: currency || "INR"
      })
      await budget.save()
    }

    res.status(201).json({
      success: true,
      message: "Budget set successfully",
      data: budget
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Get Current Budget
// ============================================
/**
 * GET /api/budget/current
 * Get current monthly budget with spending status
 */
exports.getCurrentBudget = async (req, res, next) => {
  try {
    const userId = "default_user"

    // Get budget
    let budget = await Budget.findOne({ userId })

    // If no budget set, create default
    if (!budget) {
      budget = new Budget({
        userId,
        monthlyLimit: 50000,
        alertThreshold: 80,
        currency: "INR"
      })
      await budget.save()
    }

    // Get current month's spending
    const currentDate = new Date()
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    const currentSpending = expenses[0]?.total || 0
    const expenseCount = expenses[0]?.count || 0

    // Calculate percentage and status
    const percentage = Math.round((currentSpending / budget.monthlyLimit) * 100 * 100) / 100
    let status = "SAFE"
    if (percentage >= 100) {
      status = "CRITICAL"
    } else if (percentage >= budget.alertThreshold) {
      status = "WARNING"
    }

    // Calculate remaining amount
    const remaining = Math.max(0, budget.monthlyLimit - currentSpending)

    res.status(200).json({
      success: true,
      data: {
        monthlyLimit: budget.monthlyLimit,
        currentSpending,
        remaining,
        percentage,
        status,
        alertThreshold: budget.alertThreshold,
        currency: budget.currency,
        expenseCount,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Get Budget by Month
// ============================================
/**
 * GET /api/budget/month/:month/:year
 * Get budget info for a specific month
 */
exports.getBudgetByMonth = async (req, res, next) => {
  try {
    const { month, year } = req.params
    const userId = "default_user"

    // Validate month and year
    if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month or year"
      })
    }

    // Get budget
    let budget = await Budget.findOne({ userId })

    if (!budget) {
      budget = new Budget({
        userId,
        monthlyLimit: 50000,
        alertThreshold: 80,
        currency: "INR"
      })
      await budget.save()
    }

    // Get spending for specified month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1)

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ])

    const currentSpending = expenses[0]?.total || 0
    const percentage = Math.round((currentSpending / budget.monthlyLimit) * 100 * 100) / 100

    let status = "SAFE"
    if (percentage >= 100) {
      status = "CRITICAL"
    } else if (percentage >= budget.alertThreshold) {
      status = "WARNING"
    }

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        monthlyLimit: budget.monthlyLimit,
        currentSpending,
        remaining: Math.max(0, budget.monthlyLimit - currentSpending),
        percentage,
        status,
        expenseCount: expenses[0]?.count || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Delete Budget
// ============================================
exports.deleteBudget = async (req, res, next) => {
  try {
    const userId = "default_user"

    const budget = await Budget.findOneAndDelete({ userId })

    if (!budget) {
      throw new NotFoundError("Budget")
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}
