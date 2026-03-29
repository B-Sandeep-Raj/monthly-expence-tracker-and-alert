/**
 * Add Expense Component
 * Manual expense entry form with EMI & Recurring support
 */

import React, { useState } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function AddExpense({ onSave }) {
  const [formData, setFormData] = useState({
    item: "",
    amount: "",
    category: "Food",
    paymentMethod: "Cash",
    description: "",
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: "Monthly"
  })

  const [emiData, setEmiData] = useState({
    totalAmount: "",
    tenure: "",
    rate: "",
    currentMonth: 1
  })

  const [emiCalculation, setEmiCalculation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Rental", "EMI", "Other"]
  const paymentMethods = ["Cash", "Card", "UPI", "Cheque", "Other"]
  const frequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Quarterly", "Yearly"]

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  /**
   * Handle EMI input changes
   */
  const handleEmiChange = (e) => {
    const { name, value } = e.target
    setEmiData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Calculate EMI
   */
  const calculateEMI = () => {
    const P = parseFloat(emiData.totalAmount)
    const n = parseInt(emiData.tenure)
    const r = parseFloat(emiData.rate) / 12 / 100

    if (!P || !n || !r) {
      setMessage("❌ Please fill all EMI fields")
      return
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P

    setEmiCalculation({
      monthlyEMI: Math.round(emi),
      totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest),
      totalAmount: P
    })
    setFormData(prev => ({
      ...prev,
      amount: Math.round(emi).toString()
    }))
    setMessage("✅ EMI Calculated!")
  }

  /**
   * Submit expense form
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.item.trim() || !formData.amount) {
      setMessage("❌ Please fill in item and amount")
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage("❌ Amount must be greater than 0")
      return
    }

    try {
      setLoading(true)
      
      const expensePayload = {
        item: formData.item.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        description: formData.description.trim(),
        expenseDate: new Date(formData.expenseDate),
        isRecurring: formData.isRecurring,
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : "None"
      }

      // Add EMI details if category is EMI
      if (formData.category === "EMI" && emiCalculation) {
        expensePayload.isEMI = true
        expensePayload.emiDetails = {
          totalAmount: emiCalculation.totalAmount,
          tenure: parseInt(emiData.tenure),
          rate: parseFloat(emiData.rate),
          currentMonth: parseInt(emiData.currentMonth),
          monthlyEMI: emiCalculation.monthlyEMI,
          totalInterest: emiCalculation.totalInterest
        }
      }

      const response = await axios.post(`${API_URL}/expenses/add`, expensePayload)

      if (response.data.success || response.status === 201) {
        setMessage("✅ Expense added successfully!")
        setFormData({
          item: "",
          amount: "",
          category: "Food",
          paymentMethod: "Cash",
          description: "",
          expenseDate: new Date().toISOString().split('T')[0],
          isRecurring: false,
          recurringFrequency: "Monthly"
        })
        setEmiData({
          totalAmount: "",
          tenure: "",
          rate: "",
          currentMonth: 1
        })
        setEmiCalculation(null)
        onSave()

        // Clear message after 2 seconds
        setTimeout(() => setMessage(""), 2000)
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      setMessage("❌ Error adding expense. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-expense">
      <h2>📝 Add Expense</h2>

      <form onSubmit={handleSubmit} className="expense-form">
        {/* Item Name */}
        <div className="form-group">
          <label htmlFor="item">Item Name *</label>
          <input
            type="text"
            id="item"
            name="item"
            placeholder="e.g., Groceries, Fuel, Dinner"
            value={formData.item}
            onChange={handleChange}
            required
          />
        </div>

        {/* Expense Date */}
        <div className="form-group">
          <label htmlFor="expenseDate">Expense Date</label>
          <input
            type="date"
            id="expenseDate"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount (₹) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={formData.category === "EMI" && !emiCalculation}
          />
          {formData.category === "EMI" && (
            <small>💡 Amount auto-filled after EMI calculation</small>
          )}
        </div>

        {/* EMI Calculator Section */}
        {formData.category === "EMI" && (
          <div className="emi-calculator-section">
            <h4>🏦 EMI Calculator</h4>
            <div className="form-group">
              <label htmlFor="totalAmount">Total Loan Amount (₹) *</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                placeholder="Loan amount"
                value={emiData.totalAmount}
                onChange={handleEmiChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tenure">Tenure (Months) *</label>
              <input
                type="number"
                id="tenure"
                name="tenure"
                placeholder="e.g., 60"
                value={emiData.tenure}
                onChange={handleEmiChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="rate">Interest Rate (% per annum) *</label>
              <input
                type="number"
                id="rate"
                name="rate"
                placeholder="e.g., 8.5"
                step="0.01"
                value={emiData.rate}
                onChange={handleEmiChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentMonth">Current Month of EMI</label>
              <input
                type="number"
                id="currentMonth"
                name="currentMonth"
                min="1"
                value={emiData.currentMonth}
                onChange={handleEmiChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={calculateEMI}
            >
              📊 Calculate EMI
            </button>

            {emiCalculation && (
              <div className="emi-result-box">
                <h5>✅ EMI Breakdown</h5>
                <div className="emi-result-grid">
                  <div className="result-item">
                    <span>Monthly EMI:</span>
                    <strong>₹{emiCalculation.monthlyEMI.toLocaleString()}</strong>
                  </div>
                  <div className="result-item">
                    <span>Total Amount:</span>
                    <strong>₹{emiCalculation.totalPayable.toLocaleString()}</strong>
                  </div>
                  <div className="result-item">
                    <span>Total Interest:</span>
                    <strong>₹{emiCalculation.totalInterest.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {/* Recurring Expense Checkbox */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
            />
            <span>🔄 This is a recurring expense</span>
          </label>
        </div>

        {/* Recurring Frequency */}
        {formData.isRecurring && (
          <div className="form-group">
            <label htmlFor="recurringFrequency">Frequency</label>
            <select
              id="recurringFrequency"
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
            >
              {frequencies.map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            placeholder="Add notes..."
            value={formData.description}
            onChange={handleChange}
            rows="2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "💾 Saving..." : "➕ Add Expense"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default AddExpense
