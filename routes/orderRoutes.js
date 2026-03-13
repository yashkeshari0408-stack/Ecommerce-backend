const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getOrderHistory,
  getOrderById
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// Place order
router.post(
  '/',
  authMiddleware,
  roleMiddleware('customer'),
  placeOrder
);


// Get order history 
router.get(
  '/',
  authMiddleware,
  roleMiddleware('customer'),
  getOrderHistory
);


// Get specific order 
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('customer'),
  getOrderById
);


module.exports = router;