import React, { useState, useEffect } from "react"
import axios from "axios"
import VoiceExpense from "./components/VoiceExpense"
import ExpenseList from "./components/ExpenseList"
import ExpenseChart from "./components/ExpenseChart"
import BudgetSettings from "./components/BudgetSettings"
import BudgetWarning from "./components/BudgetWarning"
import DashboardSummary from "./components/DashboardSummary"
import Analytics from "./components/Analytics"
import LoanCalculator from "./LoanCalculator"
import Reports from "./Reports"
import AddExpense from "./components/AddExpense"
import "./App.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function App() {
  const [expenses, setExpenses] = useState([])
  const [monthlyBudget, setMonthlyBudget] = useState(50000)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [budgetData, setBudgetData] = useState(null)
  const [error, setError] = useState(null)

  const loadExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`)
      setExpenses(response.data?.data || response.data)
      setError(null)
    } catch (err) {
      console.error("Error loading expenses:", err)
      setError("Failed to load expenses")
      setExpenses([])
    }
  }

  const loadBudget = async () => {
    try {
      const response = await axios.get(`${API_URL}/budget/current`)
      setBudgetData(response.data?.data)
      setMonthlyBudget(response.data?.data?.monthlyLimit || 50000)
    } catch (err) {
      console.error("Error loading budget:", err)
      setBudgetData({
        monthlyLimit: 50000,
        currentSpending: 0,
        percentage: 0,
        status: "SAFE"
      })
    }
  }

  useEffect(() => {
    loadExpenses()
    loadBudget()
  }, [])

  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div className="app">
      <header className="header">
        <h1>⚠️ Financial Warner</h1>
        <p>Your Personal Finance Guardian</p>
        <div className="header-subtitle">
          Track Expenses • Monitor Budget • Visualize Spending
        </div>
      </header>

      <nav className="navbar">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
        <button
          className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
      </nav>

      {error && <div className="error-message">❌ {error}</div>}

      {activeTab === "dashboard" && (
        <main className="main">
          <div className="section full-width">
            <DashboardSummary budgetData={budgetData} expenses={expenses} />
          </div>

          <div className="section">
            <BudgetWarning
              totalExpense={budgetData?.currentSpending || totalExpense}
              monthlyBudget={budgetData?.monthlyLimit || monthlyBudget}
              budgetData={budgetData}
            />
          </div>

          <div className="section">
            <VoiceExpense onSave={() => {
              loadExpenses()
              loadBudget()
            }} />
          </div>

          <div className="section">
            <AddExpense onSave={() => {
              loadExpenses()
              loadBudget()
            }} />
          </div>

          <div className="section full-width">
            <ExpenseList
              expenses={expenses}
              onDelete={() => {
                loadExpenses()
                loadBudget()
              }}
            />
          </div>

          <div className="section">
            <ExpenseChart expenses={expenses} />
          </div>

          <div className="section">
            <LoanCalculator />
          </div>

          <div className="section full-width">
            <Reports />
          </div>
        </main>
      )}

      {activeTab === "analytics" && (
        <main className="main">
          <Analytics expenses={expenses} budgetData={budgetData} />
        </main>
      )}

      {activeTab === "settings" && (
        <main className="main">
          <div className="section full-width">
            <BudgetSettings
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
              onSave={() => loadBudget()}
            />
          </div>
        </main>
      )}

      <footer className="footer">
        <p>Financial Warner v1.0.0 | © 2026 Smart Finance Management</p>
      </footer>
    </div>
  )
}

export default App
