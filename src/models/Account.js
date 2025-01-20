const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["bank", "mobile_money", "cash", "other"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      default: "#000000",
    },
    icon: {
      type: String,
      default: "default-icon",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
