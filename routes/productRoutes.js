const express = require('express');
const router = express.Router();

const {
  addProduct,
  updateProduct,
  getProducts
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// Public route 
router.get('/', getProducts);


// Admin 
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  addProduct
);


// Admin 
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  updateProduct
);


module.exports = router;