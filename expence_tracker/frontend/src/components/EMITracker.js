import React, { useState } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function EMITracker() {
  const [emiData, setEmiData] = useState({
    amount: "",
    tenure: "",
    rate: "",
    description: ""
  })
  const [emiResult, setEmiResult] = useState(null)
  const [message, setMessage] = useState("")

  const calculateEMI = () => {
    const P = parseFloat(emiData.amount)
    const n = parseInt(emiData.tenure)
    const r = parseFloat(emiData.rate) / 12 / 100

    if (!P || !n || !r) {
      setMessage("❌ Please fill all fields")
      return
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P

    setEmiResult({
      monthlyEMI: Math.round(emi),
      totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(P)
    })
    setMessage("✅ EMI Calculated!")
  }

  const saveEMI = async () => {
    if (!emiResult) {
      setMessage("❌ Calculate EMI first")
      return
    }

    try {
      await axios.post(`${API_URL}/expenses/add`, {
        item: `EMI - ${emiData.description}`,
        amount: emiResult.monthlyEMI,
        category: "EMI",
        paymentMethod: "Card",
        description: `Monthly EMI: ₹${emiResult.monthlyEMI} | Total Interest: ₹${emiResult.totalInterest}`,
        isEMI: true,
        emiDetails: {
          totalAmount: parseFloat(emiData.amount),
          tenure: parseInt(emiData.tenure),
          rate: parseFloat(emiData.rate),
          monthlyEMI: emiResult.monthlyEMI
        }
      })
      setMessage("✅ EMI saved as monthly expense!")
      setEmiData({ amount: "", tenure: "", rate: "", description: "" })
      setEmiResult(null)
    } catch (error) {
      setMessage("❌ Error saving EMI")
      console.error(error)
    }
  }

  return (
    <div className="emi-tracker">
      <h2>🏦 EMI Calculator & Tracker</h2>

      <div className="emi-form">
        <input
          type="number"
          placeholder="Loan Amount (₹)"
          value={emiData.amount}
          onChange={(e) => setEmiData({ ...emiData, amount: e.target.value })}
        />
        <input
          type="number"
          placeholder="Tenure (Months)"
          value={emiData.tenure}
          onChange={(e) => setEmiData({ ...emiData, tenure: e.target.value })}
        />
        <input
          type="number"
          placeholder="Interest Rate (% per annum)"
          value={emiData.rate}
          onChange={(e) => setEmiData({ ...emiData, rate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description (e.g., Car Loan)"
          value={emiData.description}
          onChange={(e) => setEmiData({ ...emiData, description: e.target.value })}
        />
        <button className="btn" onClick={calculateEMI}>
          📊 Calculate EMI
        </button>
      </div>

      {emiResult && (
        <div className="emi-result">
          <h3>EMI Breakdown</h3>
          <div className="result-grid">
            <div className="result-item">
              <label>Monthly EMI</label>
              <span className="value">₹{emiResult.monthlyEMI.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Total Amount</label>
              <span className="value">₹{emiResult.totalPayable.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Total Interest</label>
              <span className="value">₹{emiResult.totalInterest.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Principal</label>
              <span className="value">₹{emiResult.principal.toLocaleString()}</span>
            </div>
          </div>
          <button className="btn" onClick={saveEMI}>
            💾 Save as Monthly Expense
          </button>
        </div>
      )}

      {message && <p className={message.includes("✅") ? "success" : "error"}>{message}</p>}
    </div>
  )
}

export default EMITracker
