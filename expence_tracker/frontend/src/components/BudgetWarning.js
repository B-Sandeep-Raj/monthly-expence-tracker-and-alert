/**
 * Budget Warning Component
 * Displays budget status with visual indicators and progress bar
 * Shows three states: SAFE (0-80%), WARNING (80-100%), CRITICAL (>100%)
 */

import React from "react"

function BudgetWarning({ totalExpense, monthlyBudget, budgetData }) {
  const data = budgetData || { monthlyLimit: monthlyBudget, currentSpending: totalExpense }
  const percentage = (data.currentSpending / data.monthlyLimit) * 100
  const remaining = data.monthlyLimit - data.currentSpending

  // Determine status based on percentage
  let status, statusColor, statusIcon
  if (percentage > 100) {
    status = "CRITICAL"
    statusColor = "critical"
    statusIcon = "🔴"
  } else if (percentage > 80) {
    status = "WARNING"
    statusColor = "warning"
    statusIcon = "🟠"
  } else {
    status = "SAFE"
    statusColor = "safe"
    statusIcon = "🟢"
  }

  return (
    <div className="budget-warning">
      <h2>⚠️ Budget Status</h2>

      {/* Status Header */}
      <div className="budget-status-header">
        <span className={`status-badge ${statusColor}`}>
          {statusIcon} {status}
        </span>
        <span className="percentage-display">{Math.round(percentage)}%</span>
      </div>

      {/* Budget Info Grid */}
      <div className="budget-info-grid">
        <div className="budget-info-item">
          <label>Monthly Budget</label>
          <value className="value-primary">₹{data.monthlyLimit.toLocaleString()}</value>
        </div>

        <div className="budget-info-item">
          <label>Total Spent</label>
          <value className={`value-${statusColor}`}>
            ₹{data.currentSpending.toLocaleString()}
          </value>
        </div>

        <div className="budget-info-item">
          <label>Remaining</label>
          <value className={`value-${remaining >= 0 ? "safe" : "critical"}`}>
            ₹{Math.max(0, remaining).toLocaleString()}
          </value>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          {/* Safe zone (0-80%) */}
          <div
            className="progress-safe"
            style={{ width: `${Math.min(80, percentage)}%` }}
          ></div>

          {/* Warning zone (80-100%) */}
          {percentage > 80 && (
            <div
              className="progress-warning"
              style={{
                width: `${Math.min(20, Math.max(0, percentage - 80))}%`
              }}
            ></div>
          )}

          {/* Critical zone (>100%) */}
          {percentage > 100 && (
            <div
              className="progress-critical"
              style={{
                width: `${Math.min(percentage - 100, 100)}%`
              }}
            ></div>
          )}
        </div>

        {/* Progress Labels */}
        <div className="progress-labels">
          <span>0%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Messages */}
      <div className="budget-messages">
        {status === "SAFE" && (
          <p className="message success">
            ✅ You're within budget! Keep up the good spending habits.
          </p>
        )}

        {status === "WARNING" && (
          <p className="message warning">
            ⚠️ You've reached {Math.round(percentage)}% of your budget. Be careful!
          </p>
        )}

        {status === "CRITICAL" && (
          <p className="message critical">
            🔴 You exceeded your budget by ₹{Math.abs(remaining).toLocaleString()}!
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div className="budget-stats">
        <div className="stat">
          <strong>Days Left in Month:</strong>
          <span>{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days</span>
        </div>
        <div className="stat">
          <strong>Daily Average:</strong>
          <span>₹{Math.round(data.currentSpending / new Date().getDate()).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default BudgetWarning
