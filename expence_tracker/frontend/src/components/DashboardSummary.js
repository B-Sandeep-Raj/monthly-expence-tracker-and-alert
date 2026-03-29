/**
 * Dashboard Summary Component
 * Displays key metrics and statistics at a glance
 */

import React, { useEffect, useState } from "react"

function DashboardSummary({ budgetData, expenses }) {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    expenseCount: 0,
    averageExpense: 0,
    highestExpense: 0,
    topCategory: "N/A"
  })

  /**
   * Calculate summary statistics
   */
  useEffect(() => {
    if (expenses && expenses.length > 0) {
      const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const average = Math.round((total / expenses.length) * 100) / 100
      const highest = Math.max(...expenses.map(e => e.amount || 0))

      // Find top category
      const categoryCount = {}
      expenses.forEach(e => {
        const cat = e.category || "Other"
        categoryCount[cat] = (categoryCount[cat] || 0) + e.amount
      })
      const topCat = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b, "N/A")

      setSummary({
        totalExpenses: total,
        expenseCount: expenses.length,
        averageExpense: average,
        highestExpense: highest,
        topCategory: topCat
      })
    }
  }, [expenses])

  const monthDate = new Date()
  const monthName = monthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const currentDay = monthDate.getDate()
  const daysRemaining = daysInMonth - currentDay

  return (
    <div className="dashboard-summary">
      <h2>📈 Dashboard Overview</h2>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        {/* Month */}
        <div className="stat-card info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <label>Current Period</label>
            <value className="stat-value">{monthName}</value>
            <small>{daysRemaining} days remaining</small>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <label>Total Spent</label>
            <value className="stat-value">₹{summary.totalExpenses.toLocaleString()}</value>
            <small>{summary.expenseCount} transactions</small>
          </div>
        </div>

        {/* Average Expense */}
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <label>Average</label>
            <value className="stat-value">₹{summary.averageExpense.toLocaleString()}</value>
            <small>per transaction</small>
          </div>
        </div>

        {/* Highest Expense */}
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <label>Highest</label>
            <value className="stat-value">₹{summary.highestExpense.toLocaleString()}</value>
            <small>single transaction</small>
          </div>
        </div>

        {/* Budget Status */}
        {budgetData && (
          <div className={`stat-card budget-status ${budgetData.status?.toLowerCase()}`}>
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <label>Budget Status</label>
              <value className="stat-value">{budgetData.percentage}%</value>
              <small>{budgetData.status}</small>
            </div>
          </div>
        )}

        {/* Top Category */}
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <label>Top Category</label>
            <value className="stat-value">{summary.topCategory}</value>
            <small>highest spending</small>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="quick-insights">
        <h3>💡 Quick Insights</h3>
        
        <div className="insights-list">
          {daysRemaining <= 5 && (
            <div className="insight warning">
              ⏰ Only {daysRemaining} days left in this month
            </div>
          )}

          {budgetData && budgetData.status === "CRITICAL" && (
            <div className="insight critical">
              🔴 You've exceeded your monthly budget!
            </div>
          )}

          {budgetData && budgetData.status === "WARNING" && (
            <div className="insight warning">
              ⚠️ You're approaching your budget limit. Time to cut back on expenses!
            </div>
          )}

          {budgetData && budgetData.status === "SAFE" && summary.expenseCount > 0 && (
            <div className="insight success">
              ✅ Great! You're within your budget. Keep maintaining good spending habits!
            </div>
          )}

          {summary.expenseCount > 0 && (
            <div className="insight info">
              📝 You have recorded {summary.expenseCount} expenses this month.
            </div>
          )}

          {summary.expenseCount === 0 && (
            <div className="insight info">
              📝 No expenses recorded yet. Start by adding your first expense!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardSummary
