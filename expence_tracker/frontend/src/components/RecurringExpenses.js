import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState([])
  const [newRecurring, setNewRecurring] = useState({
    item: "",
    amount: "",
    category: "Food",
    frequency: "Monthly",
    paymentMethod: "Card",
    startDate: new Date().toISOString().split("T")[0]
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    loadRecurringExpenses()
  }, [])

  const loadRecurringExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`)
      const recurring = response.data.filter((exp) => exp.isRecurring)
      setRecurringExpenses(recurring)
    } catch (error) {
      console.error("Error loading recurring expenses:", error)
    }
  }

  const addRecurringExpense = async () => {
    if (!newRecurring.item || !newRecurring.amount) {
      setMessage("❌ Please fill all fields")
      return
    }

    try {
      await axios.post(`${API_URL}/expenses/add`, {
        ...newRecurring,
        isRecurring: true,
        amount: parseFloat(newRecurring.amount),
        expenseDate: new Date(newRecurring.startDate)
      })
      setMessage("✅ Recurring expense added!")
      setNewRecurring({
        item: "",
        amount: "",
        category: "Food",
        frequency: "Monthly",
        paymentMethod: "Card",
        startDate: new Date().toISOString().split("T")[0]
      })
      loadRecurringExpenses()
    } catch (error) {
      setMessage("❌ Error adding recurring expense")
      console.error(error)
    }
  }

  const deleteRecurring = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`)
      setMessage("✅ Recurring expense deleted!")
      loadRecurringExpenses()
    } catch (error) {
      setMessage("❌ Error deleting expense")
      console.error(error)
    }
  }

  const categories = ["Food", "Transport", "Entertainment", "Utilities", "Rental", "EMI", "Other"]
  const frequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "Quarterly", "Yearly"]

  return (
    <div className="recurring-expenses">
      <h2>🔄 Recurring Expenses Tracker</h2>

      <div className="recurring-form">
        <h3>➕ Add New Recurring Expense</h3>
        <input
          type="text"
          placeholder="Expense name (e.g., Netflix Subscription)"
          value={newRecurring.item}
          onChange={(e) => setNewRecurring({ ...newRecurring, item: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={newRecurring.amount}
          onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
        />
        <select
          value={newRecurring.category}
          onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={newRecurring.frequency}
          onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
        >
          {frequencies.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newRecurring.startDate}
          onChange={(e) => setNewRecurring({ ...newRecurring, startDate: e.target.value })}
        />
        <select
          value={newRecurring.paymentMethod}
          onChange={(e) => setNewRecurring({ ...newRecurring, paymentMethod: e.target.value })}
        >
          <option>Card</option>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
        </select>
        <button className="btn" onClick={addRecurringExpense}>
          ➕ Add Recurring
        </button>
      </div>

      {message && <p className={message.includes("✅") ? "success" : "error"}>{message}</p>}

      <div className="recurring-list">
        <h3>📋 Your Recurring Expenses ({recurringExpenses.length})</h3>
        {recurringExpenses.length === 0 ? (
          <p className="empty-state">No recurring expenses yet. Add one to get started! 🎯</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Frequency</th>
                <th>Next Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recurringExpenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.item}</td>
                  <td>₹{exp.amount.toLocaleString()}</td>
                  <td>{exp.category}</td>
                  <td>{exp.recurringFrequency || "Monthly"}</td>
                  <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => deleteRecurring(exp._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RecurringExpenses
