const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getOrderHistory,
  getOrderById
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid items or insufficient stock
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.post('/', authMiddleware, roleMiddleware('customer'), placeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get order history (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get('/', authMiddleware, roleMiddleware('customer'), getOrderHistory);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get specific order (Customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get('/:id', authMiddleware, roleMiddleware('customer'), getOrderById);

module.exports = router;