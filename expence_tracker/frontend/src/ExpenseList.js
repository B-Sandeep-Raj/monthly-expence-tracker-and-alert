import axios from "axios"

function ExpenseList({ expenses, onDelete }) {
  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`)
    onDelete()
  }

  let total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="expense-list">
      <h2>� Expense List</h2>
      <div className="total">Total Expenses: ₹{total}</div>
      {expenses.length === 0 ? (
        <p>No expenses yet. Add some!</p>
      ) : (
        <ul>
          {expenses.map(e => (
            <li key={e._id}>
              <span>{e.item} - ₹{e.amount}</span>
              <button className="delete-btn" onClick={() => deleteExpense(e._id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExpenseList