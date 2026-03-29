/**
 * Expense Controller
 * Handles all business logic for expense operations
 */

const Expense = require("../models/Expense")
const Budget = require("../models/Budget")
const { validateExpense, validateMonthYear } = require("../utils/validation")
const { ValidationError, NotFoundError } = require("../utils/errors")
const { Parser } = require("json2csv")

// ============================================
// Add New Expense
// ============================================
/**
 * POST /api/expenses/add
 * Creates a new expense entry
 * 
 * Request body:
 * {
 *   item: string,
 *   amount: number,
 *   category?: string,
 *   paymentMethod?: string,
 *   description?: string,
 *   expenseDate?: Date,
 *   isRecurring?: boolean,
 *   recurringFrequency?: string,
 *   isEMI?: boolean,
 *   emiDetails?: {
 *     totalAmount: number,
 *     tenure: number,
 *     rate: number,
 *     currentMonth: number,
 *     monthlyEMI: number,
 *     totalInterest: number
 *   }
 * }
 */
exports.addExpense = async (req, res, next) => {
  try {
    const { 
      item, 
      amount, 
      category, 
      paymentMethod, 
      description,
      expenseDate,
      isRecurring,
      recurringFrequency,
      isEMI,
      emiDetails
    } = req.body

    // Validate input
    const validation = validateExpense({ item, amount, category, paymentMethod })
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      })
    }

    // Create expense
    const expense = new Expense({
      item: item.trim(),
      amount: parseFloat(amount),
      category: category || "Other",
      paymentMethod: paymentMethod || "Cash",
      description: description || "",
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || "None",
      isEMI: isEMI || false,
      emiDetails: emiDetails || null,
      userId: "default_user"  // In production, use req.user.id
    })

    await expense.save()

    // Check budget status
    const budget = await Budget.findOne({ userId: "default_user" })
    const currentDate = new Date()
    const monthExpenses = await Expense.aggregate([
      {
        $match: {
          userId: "default_user",
          createdAt: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
          }
        }
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } }
      }
    ])

    const totalMontlyExpense = monthExpenses[0]?.total || 0

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
      budget: budget && {
        limit: budget.monthlyLimit,
        current: totalMontlyExpense,
        percentage: Math.round((totalMontlyExpense / budget.monthlyLimit) * 100)
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Get All Expenses
// ============================================
/**
 * GET /api/expenses
 * Fetch all expenses with optional filtering
 * 
 * Query parameters:
 * - month: number (1-12)
 * - year: number
 * - category: string
 * - sort: "asc" or "desc"
 * - limit: number
 * - page: number
 */
exports.getExpenses = async (req, res, next) => {
  try {
    const { month, year, category, sort = "desc", limit = 100, page = 1 } = req.query

    // Build query
    let query = { userId: "default_user" }

    // Filter by month and year
    if (month || year) {
      const currentYear = year ? parseInt(year) : new Date().getFullYear()
      const currentMonth = month ? parseInt(month) : new Date().getMonth()

      const startDate = new Date(currentYear, currentMonth, 1)
      const endDate = new Date(currentYear, currentMonth + 1, 1)

      query.createdAt = { $gte: startDate, $lt: endDate }
    }

    // Filter by category
    if (category) {
      query.category = category
    }

    // Calculate pagination
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 100
    const skip = (pageNum - 1) * limitNum

    // Fetch expenses
    const expenses = await Expense.find(query)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .limit(limitNum)
      .skip(skip)

    // Get total count
    const total = await Expense.countDocuments(query)

    // Calculate total amount
    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        total,
        count: expenses.length,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum
      },
      summary: {
        totalAmount: totalAmount[0]?.total || 0,
        averageExpense: total > 0 ? Math.round((totalAmount[0]?.total || 0) / total * 100) / 100 : 0
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Get Single Expense
// ============================================
exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      throw new NotFoundError("Expense")
    }

    res.status(200).json({
      success: true,
      data: expense
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Update Expense
// ============================================
/**
 * PUT /api/expenses/:id
 * Update an existing expense
 */
exports.updateExpense = async (req, res, next) => {
  try {
    const { item, amount, category, paymentMethod, description } = req.body

    // Validate input
    const validation = validateExpense({ item, amount, category, paymentMethod })
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      })
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        item: item?.trim,
        amount: amount ? parseFloat(amount) : undefined,
        category: category || "Other",
        paymentMethod: paymentMethod || "Cash",
        description: description || ""
      },
      { new: true, runValidators: true }
    )

    if (!expense) {
      throw new NotFoundError("Expense")
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Delete Expense
// ============================================
/**
 * DELETE /api/expenses/:id
 * Delete an expense by ID
 */
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)

    if (!expense) {
      throw new NotFoundError("Expense")
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: expense
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Monthly Report
// ============================================
/**
 * GET /api/expenses/monthly-report
 * Get monthly expense summary for the specified year
 * 
 * Query parameters:
 * - year: number (default: current year)
 */
exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { year } = req.query
    const currentYear = year ? parseInt(year) : new Date().getFullYear()

    const report = await Expense.aggregate([
      {
        $match: {
          userId: "default_user",
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Format months with names
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]

    const formattedReport = monthNames.map((name, index) => {
      const monthData = report.find(r => r._id === index + 1)
      return {
        month: index + 1,
        monthName: name,
        total: monthData?.total || 0,
        count: monthData?.count || 0
      }
    })

    const totalAnnual = formattedReport.reduce((sum, m) => sum + m.total, 0)

    res.status(200).json({
      success: true,
      year: currentYear,
      data: formattedReport,
      summary: {
        totalAnnual,
        averageMonthly: Math.round(totalAnnual / 12 * 100) / 100,
        highestMonth: Math.max(...formattedReport.map(m => m.total))
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Category Breakdown
// ============================================
/**
 * GET /api/expenses/category-breakdown
 * Get expense breakdown by category
 */
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const currentYear = year ? parseInt(year) : new Date().getFullYear()
    const currentMonth = month ? parseInt(month) - 1 : new Date().getMonth()

    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 1)

    const breakdown = await Expense.aggregate([
      {
        $match: {
          userId: "default_user",
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { amount: -1 } }
    ])

    const total = breakdown.reduce((sum, cat) => sum + cat.amount, 0)

    const formatted = breakdown.map(cat => ({
      category: cat._id,
      amount: cat.amount,
      percentage: total > 0 ? Math.round((cat.amount / total) * 100 * 100) / 100 : 0,
      count: cat.count
    }))

    res.status(200).json({
      success: true,
      month: currentMonth + 1,
      year: currentYear,
      data: formatted,
      summary: {
        total,
        categories: formatted.length
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Export to CSV
// ============================================
/**
 * GET /api/expenses/export
 * Export all expenses as CSV file (Professional format)
 * 
 * Query parameters:
 * - month: number
 * - year: number
 */
exports.exportToCSV = async (req, res, next) => {
  try {
    const { month, year } = req.query

    let query = { userId: "default_user" }

    // Filter by month and year if provided
    if (month || year) {
      const matchYear = year ? parseInt(year) : new Date().getFullYear()
      const matchMonth = month ? parseInt(month) - 1 : new Date().getMonth()

      const startDate = new Date(matchYear, matchMonth, 1)
      const endDate = new Date(matchYear, matchMonth + 1, 1)

      query.createdAt = { $gte: startDate, $lt: endDate }
    }

    // Fetch expenses sorted by date
    const expenses = await Expense.find(query).sort({ createdAt: 1 })

    if (expenses.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No expenses found to export"
      })
    }

    // Format data for CSV
    const formattedData = expenses.map((e, idx) => ({
      "S.No": idx + 1,
      "Item": e.item,
      "Amount (₹)": e.amount,
      "Category": e.category,
      "Payment Method": e.paymentMethod,
      "Date": new Date(e.createdAt).toLocaleDateString("en-IN"),
      "Time": new Date(e.createdAt).toLocaleTimeString("en-IN"),
      "Description": e.description
    }))

    // Calculate total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)

    // Add total row
    formattedData.push({
      "S.No": "",
      "Item": "TOTAL",
      "Amount (₹)": total,
      "Category": "",
      "Payment Method": "",
      "Date": "",
      "Time": "",
      "Description": ""
    })

    // Generate CSV
    const parser = new Parser({
      fields: ["S.No", "Item", "Amount (₹)", "Category", "Payment Method", "Date", "Time", "Description"]
    })

    const csv = parser.parse(formattedData)

    // Add header information
    const header = `Financial Warner - Expense Report
Generated: ${new Date().toLocaleString("en-IN")}
Total Expenses: ${expenses.length}
Total Amount: ₹${total}
-----------

`

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader("Content-Disposition", 'attachment; filename="Financial_Warner_Expenses.csv"')

    // Send response
    res.send(header + csv)
  } catch (error) {
    next(error)
  }
}

// ============================================
// Get Recurring Expenses
// ============================================
/**
 * GET /api/expenses/recurring
 * Get all recurring expenses
 */
exports.getRecurringExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      userId: "default_user",
      isRecurring: true
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: expenses,
      count: expenses.length
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Process Monthly Recurring Expenses
// ============================================
/**
 * POST /api/expenses/recurring/process
 * Auto-generate copies of recurring expenses for the next month
 */
exports.processMonthlyRecurring = async (req, res, next) => {
  try {
    const recurringExpenses = await Expense.find({
      userId: "default_user",
      isRecurring: true,
      recurringFrequency: "Monthly"
    })

    const newExpenses = []
    const currentDate = new Date()
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

    for (let expense of recurringExpenses) {
      // Check if expense already exists for next month
      const existingExpense = await Expense.findOne({
        userId: "default_user",
        item: expense.item,
        createdAt: {
          $gte: nextMonth,
          $lt: new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1)
        }
      })

      if (!existingExpense) {
        // Create new expense for next month
        const newExpense = new Expense({
          item: expense.item,
          amount: expense.amount,
          category: expense.category,
          paymentMethod: expense.paymentMethod,
          description: expense.description,
          expenseDate: nextMonth,
          isRecurring: true,
          recurringFrequency: expense.recurringFrequency,
          isEMI: expense.isEMI,
          emiDetails: expense.emiDetails,
          userId: "default_user"
        })

        await newExpense.save()
        newExpenses.push(newExpense)
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${newExpenses.length} recurring expenses for next month`,
      data: newExpenses,
      count: newExpenses.length
    })
  } catch (error) {
    next(error)
  }
}
