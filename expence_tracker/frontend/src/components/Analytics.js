/**
 * Analytics Component
 * Provides advanced insights with charts and trends
 */

import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const COLORS = ["#ad2831", "#800e13", "#640d14", "#38040e", "#250902", "#FFA500"]

function Analytics({ expenses = [] }) {
  const [trends, setTrends] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [paymentData, setPaymentData] = useState([])
  const [loading, setLoading] = useState(false)

  /**
   * Load analytics data
   */
  useEffect(() => {
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses])

  const loadAnalytics = async () => {
    try {
      setLoading(true)

      // Get category breakdown
      const categoryResponse = await axios.get(`${API_URL}/analytics/categories`)
      setCategoryData(categoryResponse.data?.data || [])

      // Get payment methods
      const paymentResponse = await axios.get(`${API_URL}/analytics/payment-methods`)
      setPaymentData(paymentResponse.data?.data || [])

      // Calculate monthly trends from existing expenses
      if (expenses.length > 0) {
        const monthlyData = {}
        expenses.forEach(expense => {
          const date = new Date(expense.createdAt)
          const monthKey = date.toLocaleDateString("en-IN", { year: "numeric", month: "short" })

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0
          }
          monthlyData[monthKey] += expense.amount
        })

        const trendsArray = Object.entries(monthlyData)
          .map(([month, amount]) => ({ month, amount: Math.round(amount) }))
          .sort((a, b) => new Date(a.month) - new Date(b.month))

        setTrends(trendsArray)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare category data for pie chart
  const categoryChartData = categoryData.map(cat => ({
    name: cat.category,
    value: cat.amount
  }))

  // Prepare payment method data
  const paymentChartData = paymentData.map(pay => ({
    name: pay.method,
    value: pay.amount
  }))

  return (
    <div className="analytics">
      <h2>📊 Detailed Analytics</h2>

      {loading && <p className="loading">⏳ Loading analytics...</p>}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Spending Trends */}
        {trends.length > 0 && (
          <div className="chart-container-wrapper">
            <h3>📈 Spending Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#ad2831"
                  strokeWidth={2}
                  dot={{ fill: "#ad2831", r: 4 }}
                  name="Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Breakdown */}
        {categoryChartData.length > 0 && (
          <div className="chart-container-wrapper">
            <h3>📂 Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category Details */}
            <div className="category-details">
              {categoryData.map((cat, index) => (
                <div key={index} className="category-item">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>{cat.category}</span>
                  <span className="category-amount">₹{cat.amount.toLocaleString()}</span>
                  <span className="category-percent">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {paymentChartData.length > 0 && (
          <div className="chart-container-wrapper">
            <h3>💳 Payment Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#ad2831" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {(categoryData.length > 0 || paymentData.length > 0) && (
        <div className="analytics-summary">
          <h3>📊 Summary Statistics</h3>

          <div className="summary-grid">
            {categoryData.length > 0 && (
              <div className="summary-card">
                <label>Top Category</label>
                <value>{categoryData[0]?.category || "N/A"}</value>
                <small>₹{categoryData[0]?.amount.toLocaleString()} ({categoryData[0]?.percentage}%)</small>
              </div>
            )}

            {paymentData.length > 0 && (
              <div className="summary-card">
                <label>Preferred Payment</label>
                <value>{paymentData[0]?.method || "N/A"}</value>
                <small>₹{paymentData[0]?.amount.toLocaleString()} ({paymentData[0]?.percentage}%)</small>
              </div>
            )}

            <div className="summary-card">
              <label>Total Categories</label>
              <value>{categoryData.length}</value>
              <small>expense categories tracked</small>
            </div>

            <div className="summary-card">
              <label>Total Methods</label>
              <value>{paymentData.length}</value>
              <small>payment methods used</small>
            </div>
          </div>
        </div>
      )}

      {!loading && categoryData.length === 0 && (
        <div className="no-data">
          <p>No analytics data available yet. Start adding expenses to see insights!</p>
        </div>
      )}
    </div>
  )
}

export default Analytics
