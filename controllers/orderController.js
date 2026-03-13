const Product = require('../models/Product');
const Order = require('../models/Order');
const { success, error } = require('../utils/response');


// POST /orders 
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return error(res, 'Order items are required', 400);
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return error(res, 'Invalid productId or quantity', 400);
      }

      const product = await Product.findById(productId);

      if (!product) {
        return error(res, `Product not found: ${productId}`, 404);
      }

      if (product.stock < quantity) {
        return error(
          res,
          `Insufficient stock for product ${product.name}`,
          400
        );
      }

      totalPrice += product.price * quantity;

      orderItems.push({
        product: product._id,
        quantity,
        price: product.price
      });

      product.stock -= quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalPrice
    });

    await order.save();

    return success(res, order, 'Order placed successfully', 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
};


// GET /orders 
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    return success(
      res,
      orders,
      'Order history fetched successfully'
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};


// GET /orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(id)
      .populate('items.product', 'name price description');

    if (!order) {
      return error(res, 'Order not found', 404);
    }

    if (order.user.toString() !== userId) {
      return error(res, 'Access denied', 403);
    }

    return success(
      res,
      order,
      'Order fetched successfully'
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};