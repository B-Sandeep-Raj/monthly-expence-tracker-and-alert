import { useState, useEffect } from "react"
import axios from "axios"

function Reports() {
  const [report, setReport] = useState([])
  const [expenses, setExpenses] = useState([])

  const loadReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses/monthly-report")
      setReport(res.data?.data || [])
      
      const expRes = await axios.get("http://localhost:5000/api/expenses")
      setExpenses(expRes.data?.data || expRes.data || [])
    } catch (error) {
      console.error("Error loading report:", error)
      setReport([])
      setExpenses([])
    }
  }

  const exportCSV = async () => {
    window.open("http://localhost:5000/api/expenses/export")
  }

  const downloadJSON = () => {
    const dataStr = JSON.stringify(expenses, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Financial_Warner_Expenses.json"
    link.click()
  }

  useEffect(() => {
    loadReport()
  }, [])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="reports">
      <h2>📊 Reports & Export</h2>
      
      <div className="report-section">
        <h3>Monthly Summary</h3>
        {report.length === 0 ? (
          <p>No data yet</p>
        ) : (
          report.map(r => (
            <div key={r._id} className="report-item">
              <span>Month {r._id}:</span> <strong>₹{r.total}</strong>
            </div>
          ))
        )}
      </div>

      <div className="total-section">
        <p>Total All Time: <strong>₹{total}</strong></p>
      </div>

      <div className="export-buttons">
        <button className="btn" onClick={exportCSV}>📄 Export CSV</button>
        <button className="btn" onClick={downloadJSON}>📋 Export JSON</button>
      </div>
    </div>
  )
}

export default Reports