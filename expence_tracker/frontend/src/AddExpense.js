import { useState } from "react"
import axios from "axios"

function AddExpense({ onSave }) {
  const [item, setItem] = useState("")
  const [amount, setAmount] = useState("")

  const saveExpense = async () => {
    if (item && amount) {
      await axios.post("http://localhost:5000/api/expenses/add", {
        item,
        amount: parseFloat(amount)
      })
      setItem("")
      setAmount("")
      alert("Expense Added ✅")
      onSave()
    } else {
      alert("Please fill both fields")
    }
  }

  return (
    <div className="add-expense">
      <h2>✏️ Add Expense Manually</h2>
      <input
        type="text"
        placeholder="Item (e.g., Food)"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="btn" onClick={saveExpense}>💾 Add Expense</button>
    </div>
  )
}

export default AddExpense