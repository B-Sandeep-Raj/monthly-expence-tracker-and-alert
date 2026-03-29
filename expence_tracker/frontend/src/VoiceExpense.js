import { useState } from "react"
import axios from "axios"

function VoiceExpense({ onSave }) {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState("")

  const startListening = () => {
    setTranscript("")
    setMessage("🎤 Listening...")
    setListening(true)

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.continuous = false
    recognition.lang = "en-IN"
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript
      setTranscript(speech)
      processExpense(speech)
    }

    recognition.onerror = () => {
      setMessage("❌ Microphone error")
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }

  const processExpense = async (text) => {
    const words = text.split(" ")
    const amount = parseFloat(words.find(w => !isNaN(w)))
    const item = words[0]

    if (item && amount) {
      await axios.post("http://localhost:5000/api/expenses/add", { item, amount })
      setMessage(`✅ Added: ${item} - ₹${amount}`)
      onSave()
      setTimeout(() => setMessage(""), 2000)
    } else {
      setMessage("⚠️ Say: Item Amount (e.g., Petrol 500)")
    }
  }

  return (
    <div className="voice-expense">
      <h2>🎙️ Voice Expense</h2>
      <p>Say: "Item Amount" (e.g., "Petrol 500")</p>
      <button className={`btn ${listening ? "listening" : ""}`} onClick={startListening} disabled={listening}>
        {listening ? "🔊 Listening..." : "🔊 Start Speaking"}
      </button>
      <p className="transcript">{transcript || "Waiting for voice..."}</p>
      <p className="message">{message}</p>
    </div>
  )
}

export default VoiceExpense