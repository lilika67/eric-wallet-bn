const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getCategories);

// Add new category
router.post('/', categoryController.addCategory);

// Update category
router.put('/:id', categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

// Get category with subcategories
router.get('/:id/subcategories', categoryController.getCategoryWithSubcategories);

module.exports = router; 