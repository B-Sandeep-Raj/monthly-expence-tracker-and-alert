/**
 * Budget Settings Component
 * Allows users to configure their monthly budget limit and alert thresholds
 */

import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function BudgetSettings({ monthlyBudget, setMonthlyBudget, onSave, theme, onThemeChange }) {
  const [budget, setBudget] = useState(monthlyBudget)
  const [threshold, setThreshold] = useState(80)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  /**
   * Load current budget settings
   */
  useEffect(() => {
    loadBudgetSettings()
  }, [])

  const loadBudgetSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/budget/current`)
      if (response.data?.data) {
        setBudget(response.data.data.monthlyLimit)
        setThreshold(response.data.data.alertThreshold || 80)
      }
    } catch (error) {
      console.error("Error loading budget:", error)
    }
  }

  /**
   * Save budget settings
   */
  const saveBudget = async (e) => {
    e.preventDefault()

    if (!budget || budget <= 0) {
      setMessage("❌ Budget must be greater than 0")
      return
    }

    if (threshold < 50 || threshold > 100) {
      setMessage("❌ Alert threshold must be between 50-100%")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${API_URL}/budget/set`, {
        monthlyLimit: parseFloat(budget),
        alertThreshold: parseInt(threshold)
      })

      if (response.data.success) {
        setMonthlyBudget(parseFloat(budget))
        setMessage("✅ Budget settings saved successfully!")
        onSave()

        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error saving budget:", error)
      setMessage("❌ Error saving budget settings")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle theme change
   */
  const handleThemeClick = (newTheme) => {
    if (onThemeChange) {
      onThemeChange(newTheme)
    }
  }

  /**
   * Export expenses as CSV
   */
  const exportToCSV = async () => {
    try {
      await axios.get(`${API_URL}/expenses/export/csv`)
      // CSV is automatically downloaded by the browser
      setMessage("✅ Expenses exported successfully!")
      setTimeout(() => setMessage(""), 2000)
    } catch (error) {
      console.error("Error exporting:", error)
      setMessage("❌ Error exporting expenses")
    }
  }

  return (
    <div className="budget-settings">
      <h2>⚙️ Settings & Preferences</h2>

      {/* Budget Settings */}
      <div className="settings-section">
        <h3>💰 Budget Configuration</h3>
        
        <form onSubmit={saveBudget} className="settings-form">
          {/* Monthly Budget */}
          <div className="form-group">
            <label htmlFor="monthlyBudget">Monthly Budget Limit (₹)</label>
            <input
              type="number"
              id="monthlyBudget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="100"
              step="100"
            />
            <small>Your maximum monthly spending limit</small>
          </div>

          {/* Alert Threshold */}
          <div className="form-group">
            <label htmlFor="threshold">
              Alert Threshold: {threshold}%
            </label>
            <input
              type="range"
              id="threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              min="50"
              max="100"
              step="5"
              className="range-slider"
            />
            <small>Trigger warning when spending reaches this percentage</small>
          </div>

          {/* Threshold Description */}
          <div className="threshold-info">
            <p>
              {threshold <= 80 ? (
                <span>Alert will show <span className="badge warning">⚠️ WARNING</span> when you reach {threshold}%</span>
              ) : (
                <span>Alert will show <span className="badge warning">⚠️ WARNING</span> when you reach {threshold}%</span>
              )}
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "💾 Saving..." : "💾 Save Budget Settings"}
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="settings-section">
        <h3>🎨 Appearance</h3>
        
        <div className="theme-selector">
          <button
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => handleThemeClick("light")}
          >
            ☀️ Light
          </button>
          <button
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => handleThemeClick("dark")}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* Export Settings */}
      <div className="settings-section">
        <h3>📊 Data Export</h3>
        
        <p>Export all your expenses as a CSV file for record keeping or analysis.</p>
        
        <button
          className="btn btn-secondary"
          onClick={exportToCSV}
        >
          📥 Export as CSV
        </button>
      </div>

      {/* App Info */}
      <div className="settings-section">
        <h3>ℹ️ About</h3>
        
        <div className="app-info">
          <p><strong>Application:</strong> Financial Warner</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Status:</strong> Production Ready</p>
          <p><strong>License:</strong> MIT</p>
          
          <div className="feature-list">
            <h4>Features:</h4>
            <ul>
              <li>✅ Voice-based expense input</li>
              <li>✅ Real-time budget monitoring</li>
              <li>✅ Expense tracking with categories</li>
              <li>✅ Data visualization and charts</li>
              <li>✅ CSV export functionality</li>
              <li>✅ Loan/EMI calculator</li>
              <li>✅ Monthly reports</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default BudgetSettings
