import { useState } from "react"

function Settings({ monthlyBudget, setMonthlyBudget }) {
  const [newBudget, setNewBudget] = useState(monthlyBudget)

  const saveBudget = () => {
    setMonthlyBudget(newBudget)
    alert("✅ Budget updated to ₹" + newBudget)
  }

  return (
    <div className="settings">
      <h2>⚙️ Settings</h2>
      <div className="setting-item">
        <label>Monthly Budget (₹)</label>
        <input
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(parseFloat(e.target.value))}
        />
        <button className="btn" onClick={saveBudget}>💾 Save Budget</button>
      </div>
    </div>
  )
}

export default Settings