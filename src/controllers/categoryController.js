const Category = require("../models/Category");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parent: null }).populate({
      path: "subcategories",
      select: "name type color icon",
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const { name, type, parent, color, icon } = req.body;
    const category = new Category({
      name,
      type,
      parent: parent || null,
      color,
      icon,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.color = color || category.color;
    category.icon = icon || category.icon;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parent: category._id });
    if (hasSubcategories) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with subcategories" });
    }

    await category.remove();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category with subcategories
exports.getCategoryWithSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate({
      path: "subcategories",
      select: "name type color icon",
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
