/**
 * Budget Model
 * Stores monthly budget configuration and thresholds for each user
 * 
 * Fields:
 * - userId: Reference to the user
 * - monthlyLimit: Maximum spending limit for the month
 * - alertThreshold: Percentage threshold to trigger warnings (default: 80%)
 * - currency: Currency code (default: INR)
 * - createdAt: When this budget was created
 * - updatedAt: When this budget was last updated
 */

const mongoose = require("mongoose")

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    default: "default_user",
    index: true
  },

  monthlyLimit: {
    type: Number,
    required: [true, "Monthly limit is required"],
    min: [100, "Monthly limit must be at least 100"],
    max: [9999999, "Monthly limit cannot exceed 9999999"]
  },

  alertThreshold: {
    type: Number,
    default: 80,
    min: [50, "Alert threshold must be at least 50%"],
    max: [100, "Alert threshold cannot exceed 100%"]
  },

  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR", "GBP", "AUD"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Pre-save middleware
BudgetSchema.pre("save", function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Budget", BudgetSchema)
