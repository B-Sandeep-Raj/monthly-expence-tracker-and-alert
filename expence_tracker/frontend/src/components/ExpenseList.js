/**
 * Expense List Component
 * Displays all expenses in a filterable, sortable list with delete functionality
 */

import React, { useState } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ExpenseList({ expenses = [], onDelete }) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [deleteLoading, setDeleteLoading] = useState(null)

  /**
   * Delete an expense
   */
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return
    }

    try {
      setDeleteLoading(id)
      await axios.delete(`${API_URL}/expenses/${id}`)
      onDelete()
    } catch (error) {
      console.error("Error deleting expense:", error)
      alert("Failed to delete expense")
    } finally {
      setDeleteLoading(null)
    }
  }

  /**
   * Filter expenses
   */
  const filteredExpenses = expenses.filter(e => {
    if (filter === "day") {
      const today = new Date()
      const expenseDate = new Date(e.createdAt)
      return expenseDate.toDateString() === today.toDateString()
    }
    if (filter === "week") {
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const expenseDate = new Date(e.createdAt)
      return expenseDate >= weekAgo && expenseDate <= today
    }
    if (filter === "month") {
      const today = new Date()
      const expenseDate = new Date(e.createdAt)
      return expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
    }
    return true
  })

  /**
   * Sort expenses
   */
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === "amount") {
      return b.amount - a.amount
    }
    if (sortBy === "name") {
      return a.item.localeCompare(b.item)
    }
    return 0
  })

  const totalAmount = sortedExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="expense-list">
      <h2>📋 Recent Expenses</h2>

      {/* Filters */}
      <div className="expense-filters">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="date">Latest First</option>
          <option value="amount">Highest Amount</option>
          <option value="name">Alphabetically</option>
        </select>
      </div>

      {/* Expense List */}
      {sortedExpenses.length === 0 ? (
        <p className="no-expenses">No expenses found</p>
      ) : (
        <>
          <ul className="expense-items">
            {sortedExpenses.map((expense) => (
              <li key={expense._id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-header">
                    <span className="expense-name">{expense.item}</span>
                    <span className="expense-category">{expense.category || "Other"}</span>
                  </div>
                  <div className="expense-meta">
                    <span className="expense-date">
                      {new Date(expense.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <span className="expense-time">
                      {new Date(expense.createdAt).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="expense-amount-delete">
                  <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(expense._id)}
                    disabled={deleteLoading === expense._id}
                    title="Delete expense"
                  >
                    {deleteLoading === expense._id ? "🗑️..." : "🗑️"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="expense-summary">
            <div className="summary-stat">
              <label>Total ({sortedExpenses.length} items)</label>
              <value className="summary-value">₹{totalAmount.toLocaleString()}</value>
            </div>
            <div className="summary-stat">
              <label>Average</label>
              <value className="summary-value">
                ₹{sortedExpenses.length > 0 ? Math.round(totalAmount / sortedExpenses.length).toLocaleString() : "0"}
              </value>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExpenseList
