import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseChart({ expenses }) {
  const labels = expenses.map(e => e.item)
  const dataValues = expenses.map(e => e.amount)

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expenses (₹)",
        data: dataValues,
        backgroundColor: 'rgba(173, 40, 49, 0.6)', // var(--brown-red) with alpha
        borderColor: '#ad2831ff', // var(--brown-red)
        borderWidth: 1,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expense Breakdown',
      },
    },
  }

  return (
    <div className="expense-chart">
      <h2>� Expense Chart</h2>
      {expenses.length === 0 ? (
        <p>Add some expenses to see the chart!</p>
      ) : (
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  )
}

export default ExpenseChart