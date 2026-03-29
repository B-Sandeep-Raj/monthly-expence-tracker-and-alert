/**
 * Validation Utilities
 * Provides functions to validate expense and budget data
 */

// Validate expense object
const validateExpense = (data) => {
  const errors = []

  if (!data.item || typeof data.item !== "string" || data.item.trim().length === 0) {
    errors.push("Item name is required and must be a string")
  }

  if (!data.amount || typeof data.amount !== "number") {
    errors.push("Amount is required and must be a number")
  }

  if (data.amount && (data.amount <= 0 || data.amount > 999999)) {
    errors.push("Amount must be between 0.01 and 999999")
  }

  if (data.category && !["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Other"].includes(data.category)) {
    errors.push("Invalid category")
  }

  if (data.paymentMethod && !["Cash", "Card", "UPI", "Cheque", "Other"].includes(data.paymentMethod)) {
    errors.push("Invalid payment method")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate budget object
const validateBudget = (data) => {
  const errors = []

  if (!data.monthlyLimit || typeof data.monthlyLimit !== "number") {
    errors.push("Monthly limit is required and must be a number")
  }

  if (data.monthlyLimit && (data.monthlyLimit < 100 || data.monthlyLimit > 9999999)) {
    errors.push("Monthly limit must be between 100 and 9999999")
  }

  if (data.alertThreshold && (data.alertThreshold < 50 || data.alertThreshold > 100)) {
    errors.push("Alert threshold must be between 50 and 100")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate date range for filtering
const validateDateRange = (startDate, endDate) => {
  const errors = []

  if (startDate) {
    const start = new Date(startDate)
    if (isNaN(start.getTime())) {
      errors.push("Invalid start date format")
    }
  }

  if (endDate) {
    const end = new Date(endDate)
    if (isNaN(end.getTime())) {
      errors.push("Invalid end date format")
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Parse and validate month and year
const validateMonthYear = (month, year) => {
  const errors = []

  if (month && (isNaN(month) || month < 1 || month > 12)) {
    errors.push("Month must be between 1 and 12")
  }

  if (year && (isNaN(year) || year < 2000 || year > 2100)) {
    errors.push("Year must be between 2000 and 2100")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

module.exports = {
  validateExpense,
  validateBudget,
  validateDateRange,
  validateMonthYear
}
