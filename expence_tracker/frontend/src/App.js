import React, { useState, useEffect } from "react"
import axios from "axios"
// eslint-disable-next-line no-unused-vars
import VoiceExpense from "./components/VoiceExpense"
// eslint-disable-next-line no-unused-vars
import ExpenseList from "./components/ExpenseList"
// eslint-disable-next-line no-unused-vars
import ExpenseChart from "./components/ExpenseChart"
// eslint-disable-next-line no-unused-vars
import BudgetSettings from "./components/BudgetSettings"
// eslint-disable-next-line no-unused-vars
import BudgetWarning from "./components/BudgetWarning"
// eslint-disable-next-line no-unused-vars
import DashboardSummary from "./components/DashboardSummary"
// eslint-disable-next-line no-unused-vars
import Analytics from "./components/Analytics"
// eslint-disable-next-line no-unused-vars
import LoanCalculator from "./LoanCalculator"
// eslint-disable-next-line no-unused-vars
import Reports from "./Reports"
// eslint-disable-next-line no-unused-vars
import AddExpense from "./components/AddExpense"
// eslint-disable-next-line no-unused-vars
import EMITracker from "./components/EMITracker"
// eslint-disable-next-line no-unused-vars
import RecurringExpenses from "./components/RecurringExpenses"
import Navbar from "./components/Navbar"
import "./App.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const DEFAULT_BUDGET = 50000

function App() {
  const [expenses, setExpenses] = useState([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [budgetData, setBudgetData] = useState(null)
  const [theme, setTheme] = useState("light")

  const loadExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`)
      setExpenses(response.data?.data || response.data)
    } catch (err) {
      console.error("Error loading expenses:", err)
      setExpenses([])
    }
  }

  const loadBudget = async () => {
    try {
      const response = await axios.get(`${API_URL}/budget/current`)
      setBudgetData(response.data?.data)
    } catch (err) {
      console.error("Error loading budget:", err)
      setBudgetData({
        monthlyLimit: DEFAULT_BUDGET,
        currentSpending: 0,
        percentage: 0,
        status: "SAFE"
      })
    }
  }

  // Initialize theme from localStorage on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme") || "light"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
    loadExpenses()
    loadBudget()
  }, [])

  // Update document theme when theme state changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("appTheme", theme)
  }, [theme])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <header className="header">
        <div className="header-content">
          <h1>💰 Financial Warner</h1>
          <p>Your Personal Finance Guardian</p>
          <div className="header-subtitle">
            Track Expenses • Monitor Budget • Visualize Spending
          </div>
        </div>
      </header>

      {activeTab === "dashboard" && (
        <main className="main">
          <div className="section full-width">
            <DashboardSummary budgetData={budgetData} expenses={expenses} />
          </div>

          <div className="section">
            <BudgetWarning
              totalExpense={budgetData?.currentSpending || totalExpense}
              monthlyBudget={budgetData?.monthlyLimit || DEFAULT_BUDGET}
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

          <div className="section">
            <EMITracker />
          </div>

          <div className="section full-width">
            <RecurringExpenses />
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
              onSave={() => loadBudget()} 
              theme={theme}
              onThemeChange={handleThemeChange}
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
