function BudgetWarning({ totalExpense, monthlyBudget }) {
    const percentage = (totalExpense / monthlyBudget) * 100
    const remaining = monthlyBudget - totalExpense
    const status = percentage > 100 ? "🔴 CRITICAL" : percentage > 80 ? "🟠 WARNING" : "🟢 SAFE"
  
    return (
      <div className="budget-warning">
        <h2>⚠️ Budget Status</h2>
        <div className="budget-info">
          <p>Monthly Budget: ₹{monthlyBudget}</p>
          <p>Total Spent: ₹{totalExpense}</p>
          <p>Remaining: ₹{Math.max(0, remaining)}</p>
          <p className="status">{status} - {percentage.toFixed(0)}%</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
        {remaining < 0 && <p className="danger">⚠️ You exceeded budget by ₹{Math.abs(remaining)}</p>}
      </div>
    )
  }
  
  export default BudgetWarning