import { useState } from "react"

function LoanCalculator() {
  const [principal, setPrincipal] = useState("")
  const [rate, setRate] = useState("")
  const [time, setTime] = useState("")
  const [interest, setInterest] = useState(0)
  const [total, setTotal] = useState(0)

  const calculate = () => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const t = parseFloat(time) || 0
    const i = (p * r * t) / 100
    setInterest(i)
    setTotal(p + i)
  }

  return (
    <div className="calculator">
      <h2>🧮 Loan Interest Calculator</h2>
      <input
        type="number"
        placeholder="Principal Amount (₹)"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Time (Years)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button className="btn" onClick={calculate}>🧮 Calculate</button>
      <div className="result">
        <p>Interest: ₹{interest.toFixed(2)}</p>
        <p>Total Amount: ₹{total.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default LoanCalculator