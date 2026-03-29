/**
 * Expense Model
 * Represents a single expense entry in the database
 * 
 * Fields:
 * - item: Name/description of the expense
 * - amount: Expense amount in currency units
 * - category: Type of expense (Food, Transport, etc.)
 * - paymentMethod: How the payment was made (Cash, Card, UPI)
 * - description: Additional details about the expense
 * - userId: Reference to the user who created this expense
 * - tags: Array of tags for filtering and organization
 * - createdAt: Automatic timestamp of creation
 * - updatedAt: Automatic timestamp of last update
 */

const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    minlength: [2, "Item name must be at least 2 characters"],
    maxlength: [100, "Item name cannot exceed 100 characters"]
  },
  
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0.01, "Amount must be greater than 0"],
    max: [999999, "Amount cannot exceed 999999"]
  },
  
  category: {
    type: String,
    enum: {
      values: ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Rental", "EMI", "Other"],
      message: "Category must be one of: Food, Transport, Entertainment, Shopping, Bills, Health, Education, Rental, EMI, Other"
    },
    default: "Other"
  },
  
  paymentMethod: {
    type: String,
    enum: {
      values: ["Cash", "Card", "UPI", "Cheque", "Other"],
      message: "Payment method must be one of: Cash, Card, UPI, Cheque, Other"
    },
    default: "Cash"
  },

  expenseDate: {
    type: Date,
    default: Date.now
  },

  isRecurring: {
    type: Boolean,
    default: false
  },

  recurringFrequency: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly", "Yearly", "None"],
    default: "None"
  },

  isEMI: {
    type: Boolean,
    default: false
  },

  emiDetails: {
    totalAmount: Number,
    tenure: Number,
    rate: Number,
    currentMonth: Number
  },
  
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: ""
  },
  
  userId: {
    type: String,
    default: "default_user"
  },
  
  tags: {
    type: [String],
    default: []
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true  // Index for faster queries
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Automatic createdAt and updatedAt
})

// Compound index for efficient filtering by user and date
ExpenseSchema.index({ userId: 1, createdAt: -1 })

// Create virtual for month and year
ExpenseSchema.virtual("month").get(function() {
  return this.createdAt.getMonth() + 1
})

ExpenseSchema.virtual("year").get(function() {
  return this.createdAt.getFullYear()
})

// Pre-save middleware to update updatedAt
ExpenseSchema.pre("save", function(next) {
  this.updatedAt = Date.now()
  next()
})

// Ensure virtuals are serialized
ExpenseSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Expense", ExpenseSchema)