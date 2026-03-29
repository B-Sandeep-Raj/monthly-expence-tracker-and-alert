/**
 * Voice Expense Component - Hold-to-Talk
 * Allows users to input expenses by holding and speaking
 * Supports multiple languages and automatic language detection
 * Format: "Item Amount" (e.g., "Petrol 500", "Chai 50", "Gas 1000")
 */

import React, { useState, useRef, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Language configurations
const LANGUAGES = {
  "en-IN": "🇮🇳 English (India)",
  "en-US": "🇺🇸 English (US)",
  "hi-IN": "🇮🇳 हिंदी (Hindi)",
  "ta-IN": "🇮🇳 தமிழ் (Tamil)",
  "te-IN": "🇮🇳 తెలుగు (Telugu)",
  "mr-IN": "🇮🇳 मराठी (Marathi)",
  "es-ES": "🇪🇸 Español (Spanish)",
  "fr-FR": "🇫🇷 Français (French)",
  "de-DE": "🇩🇪 Deutsch (German)",
  "pt-BR": "🇧🇷 Português (Brazilian)",
  "ja-JP": "🇯🇵 日本語 (Japanese)",
  "zh-CN": "🇨🇳 中文 (Chinese)"
}

function VoiceExpense({ onSave }) {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN")
  const [recordingTime, setRecordingTime] = useState(0)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  /**
   * Initialize Web Speech API with selected language
   */
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessage("❌ Speech Recognition not supported in your browser")
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.lang = selectedLanguage
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    return recognition
  }

  /**
   * Extract numbers from text (handles various formats)
   */
  const extractNumbers = (text) => {
    // Match numbers with optional decimal points and common currency symbols
    const matches = text.match(/[\d,]+(?:\.\d{1,2})?/g)
    return matches ? matches.map(m => parseFloat(m.replace(/,/g, ''))) : []
  }

  /**
   * Parse voice input and create expense
   * Supports multiple languages and formats
   * Examples: "Petrol 500", "Coffee 150", "Gas 1000"
   */
  const processExpense = async (text) => {
    try {
      const cleanText = text.trim().toLowerCase()

      if (cleanText.length < 2) {
        return
      }

      // Extract all numbers from text
      const numbers = extractNumbers(cleanText)

      if (numbers.length === 0) {
        return
      }

      // Amount is the last number if multiple, or first significant one
      const amount = numbers[numbers.length > 1 ? numbers.length - 1 : 0]

      if (!amount || amount <= 0) {
        return
      }

      // Remove numbers from text to get item name
      let itemName = cleanText.replace(/[\d,$€£]{1,}/g, '').trim()
      
      // Clean up extra spaces
      itemName = itemName.replace(/\s+/g, ' ').trim()

      if (!itemName || itemName.length < 1) {
        itemName = "Expense"
      }

      // Capitalize first letter
      itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1)

      // Create expense
      const response = await axios.post(`${API_URL}/expenses/add`, {
        item: itemName,
        amount: parseFloat(amount),
        category: "Other",
        paymentMethod: "Cash"
      })

      if (response.data.success) {
        setMessage(`✅ Added: ${itemName} - ₹${amount}`)
        onSave()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      setMessage("❌ Error recording expense. Try again.")
    }
  }

  /**
   * Start voice listening (on mouse down / touch start)
   */
  const startListening = () => {
    const recognition = initRecognition()
    if (!recognition) return

    recognitionRef.current = recognition
    setTranscript("")
    setMessage("")
    setListening(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 100)

    let interimTranscript = ""

    recognition.onstart = () => {
      setMessage("🎤 Listening... (Hold mic button)")
    }

    recognition.onresult = (event) => {
      interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          setTranscript(prev => prev + (prev ? " " : "") + transcript)
          processExpense(transcript)
        } else {
          interimTranscript += transcript
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event) => {
      setMessage(`❌ Error: ${event.error}`)
      stopListening()
    }

    recognition.onend = () => {
      stopListening()
    }

    recognition.start()
  }

  /**
   * Stop voice listening (on mouse up / touch end)
   */
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setListening(false)
    setRecordingTime(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="voice-expense">
      <h2>🎙️ Voice Expense Input - Hold to Talk</h2>

      {/* Language Selector */}
      <div className="language-selector">
        <label>🌐 Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={listening}
          className="language-select"
        >
          {Object.entries(LANGUAGES).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Hold-to-Talk Mic Button */}
      <div className="mic-button-container">
        <button
          className={`btn-mic-hold ${listening ? "active" : ""}`}
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onMouseLeave={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          title="Hold to record, release to stop"
        >
          <span className={`mic-icon ${listening ? "pulse" : ""}`}>🎤</span>
          <span className="mic-text">
            {listening ? `Recording... ${recordingTime / 10}s` : "HOLD TO SPEAK"}
          </span>
          {listening && <span className="pulse-ring"></span>}
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="transcript-box">
          <p><strong>📝 You said:</strong> {transcript}</p>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <p className={`message ${message.includes("✅") ? "success" : message.includes("❌") ? "error" : "info"}`}>
          {message}
        </p>
      )}

      {/* Instructions and Tips */}
      <div className="voice-tips">
        <h4>💡 How to Use:</h4>
        <ul>
          <li><strong>Hold</strong> the button to start speaking</li>
          <li><strong>Release</strong> the button when done</li>
          <li>Say: "Item Amount" (e.g., "Coffee 150")</li>
          <li>Works in multiple languages 🌍</li>
          <li>Works best in quiet environments</li>
          <li>Supported in most modern browsers</li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceExpense
