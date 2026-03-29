/**
 * Analytics Controller
 * Provides advanced analytics and spending insights
 */

const Expense = require("../models/Expense")

// ============================================
// Spending Trends
// ============================================
/**
 * GET /api/analytics/spending-trends
 * Get spending trends over time
 * 
 * Query parameters:
 * - period: "6months" | "1year" | "3months" (default: 6months)
 */
exports.getSpendingTrends = async (req, res, next) => {
  try {
    const { period = "6months" } = req.query
    const userId = "default_user"

    // Calculate date range
    const endDate = new Date()
    let startDate = new Date()

    if (period === "1year") {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else if (period === "3months") {
      startDate.setMonth(startDate.getMonth() - 3)
    } else {
      startDate.setMonth(startDate.getMonth() - 6)
    }

    // Get monthly totals
    const trends = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    // Format response
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]

    const formattedTrends = trends.map(t => ({
      month: t._id.month,
      year: t._id.year,
      monthName: monthNames[t._id.month - 1],
      amount: t.total,
      count: t.count,
      average: Math.round(t.total / t.count * 100) / 100
    }))

    const totalSpending = formattedTrends.reduce((sum, t) => sum + t.amount, 0)
    const highestMonth = Math.max(...formattedTrends.map(t => t.amount))
    const lowestMonth = Math.min(...formattedTrends.map(t => t.amount))
    const averageMonth = Math.round(totalSpending / formattedTrends.length * 100) / 100

    res.status(200).json({
      success: true,
      period,
      startDate,
      endDate,
      data: formattedTrends,
      summary: {
        totalSpending,
        highestMonth,
        lowestMonth,
        averageMonth,
        trendMonths: formattedTrends.length
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Category Analytics
// ============================================
/**
 * GET /api/analytics/categories
 * Get detailed category-wise spending analysis
 * 
 * Query parameters:
 * - period: "month" | "quarter" | "year" (default: month)
 */
exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const { period = "month" } = req.query
    const userId = "default_user"

    // Calculate date range
    const endDate = new Date()
    let startDate = new Date()

    if (period === "quarter") {
      startDate.setMonth(startDate.getMonth() - 3)
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else {
      startDate.setDate(1)
    }

    // Get category breakdown
    const categories = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avgExpense: { $avg: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ])

    const totalSpending = categories.reduce((sum, cat) => sum + cat.total, 0)

    const formattedCategories = categories.map(cat => ({
      category: cat._id,
      amount: cat.total,
      percentage: totalSpending > 0 ? Math.round((cat.total / totalSpending) * 100 * 100) / 100 : 0,
      count: cat.count,
      averageExpense: Math.round(cat.avgExpense * 100) / 100
    }))

    res.status(200).json({
      success: true,
      period,
      startDate,
      endDate,
      data: formattedCategories,
      summary: {
        totalSpending,
        categoryCount: formattedCategories.length,
        topCategory: formattedCategories[0]?.category || "N/A",
        topCategoryAmount: formattedCategories[0]?.amount || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Payment Method Analytics
// ============================================
/**
 * GET /api/analytics/payment-methods
 * Get spending breakdown by payment method
 */
exports.getPaymentMethodAnalytics = async (req, res, next) => {
  try {
    const userId = "default_user"
    const { month, year } = req.query

    let matchQuery = { userId }

    // Optional: filter by specific month
    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 1)
      matchQuery.createdAt = { $gte: startDate, $lt: endDate }
    }

    const methods = await Expense.aggregate([
      {
        $match: matchQuery
      },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ])

    const totalSpending = methods.reduce((sum, m) => sum + m.total, 0)

    const formatted = methods.map(m => ({
      method: m._id,
      amount: m.total,
      percentage: totalSpending > 0 ? Math.round((m.total / totalSpending) * 100 * 100) / 100 : 0,
      count: m.count
    }))

    res.status(200).json({
      success: true,
      data: formatted,
      summary: {
        totalSpending,
        methodCount: formatted.length,
        mostUsedMethod: formatted[0]?.method || "N/A"
      }
    })
  } catch (error) {
    next(error)
  }
}

// ============================================
// Dashboard Summary
// ============================================
/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard summary
 */
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = "default_user"
    const currentDate = new Date()

    // Current month dates
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

    // Current year dates
    const yearStart = new Date(currentDate.getFullYear(), 0, 1)
    const yearEnd = new Date(currentDate.getFullYear() + 1, 0, 1)

    // Last 30 days
    const thirtyDaysAgo = new Date(currentDate)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get all aggregates in parallel
    const [monthExpenses, yearExpenses, last30Days, topExpenses, topCategories] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: monthStart, $lt: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: yearStart, $lt: yearEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: thirtyDaysAgo, $lt: currentDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Expense.find({ userId }).sort({ amount: -1 }).limit(5),
      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: monthStart, $lt: monthEnd }
          }
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
    ])

    res.status(200).json({
      success: true,
      data: {
        monthlySpending: {
          total: monthExpenses[0]?.total || 0,
          count: monthExpenses[0]?.count || 0
        },
        yearlySpending: {
          total: yearExpenses[0]?.total || 0,
          count: yearExpenses[0]?.count || 0
        },
        last30Days: {
          total: last30Days[0]?.total || 0,
          count: last30Days[0]?.count || 0
        },
        topExpenses: topExpenses.map(e => ({
          item: e.item,
          amount: e.amount,
          date: e.createdAt
        })),
        topCategories: topCategories.map(c => ({
          category: c._id,
          amount: c.total
        }))
      },
      timestamp: new Date(),
      period: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      }
    })
  } catch (error) {
    next(error)
  }
}
