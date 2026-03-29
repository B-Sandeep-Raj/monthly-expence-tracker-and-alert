/**
 * Expense Chart Component
 * Visualizes expense data using multiple chart types
 */

import React from "react"
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

const COLORS = ["#ad2831", "#800e13", "#640d14", "#38040e", "#250902", "#FFA500"]

function ExpenseChart({ expenses = [] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-chart">
        <h2>📊 Expense Visualization</h2>
        <p className="no-data">No expenses to visualize yet</p>
      </div>
    )
  }

  // Prepare data for bar chart
  const barChartData = expenses
    .slice(-10) // Last 10 expenses
    .map(e => ({
      name: e.item,
      amount: e.amount
    }))

  // Prepare data for pie chart (by category)
  const categoryTotals = {}
  expenses.forEach(e => {
    const category = e.category || "Other"
    categoryTotals[category] = (categoryTotals[category] || 0) + e.amount
  })

  const pieChartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount
    }))
    .sort((a, b) => b.value - a.value)

  // Calculate totals
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="expense-chart">
      <h2>📊 Expense Visualization</h2>

      <div className="charts-container">
        {/* Bar Chart - Last 10 Expenses */}
        <div className="chart">
          <h3>📈 Recent Expenses (Last 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "5px" }}
              />
              <Bar dataKey="amount" fill="#ad2831" name="Amount (₹)" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Category Distribution */}
        {pieChartData.length > 0 && (
          <div className="chart">
            <h3>📂 Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ₹${Math.round(value)} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Math.round(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category Stats */}
            <div className="category-stats">
              {pieChartData.map((cat, index) => (
                <div key={`cat-${index}`} className="cat-stat">
                  <div
                    className="cat-color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="cat-info">
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-amount">₹{Math.round(cat.value).toLocaleString()}</span>
                  </div>
                  <span className="cat-percent">
                    {((cat.value / totalExpense) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="chart-summary">
        <div className="summary-item">
          <label>Total Expenses</label>
          <value>₹{totalExpense.toLocaleString()}</value>
        </div>
        <div className="summary-item">
          <label>Average Expense</label>
          <value>₹{Math.round(totalExpense / expenses.length).toLocaleString()}</value>
        </div>
        <div className="summary-item">
          <label>Transactions</label>
          <value>{expenses.length}</value>
        </div>
        <div className="summary-item">
          <label>Categories</label>
          <value>{Object.keys(categoryTotals).length}</value>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart
