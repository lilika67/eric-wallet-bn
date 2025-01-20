const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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

// Virtual for getting subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

module.exports = mongoose.model("Category", categorySchema);
