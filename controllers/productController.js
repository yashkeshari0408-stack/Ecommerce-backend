const Product = require('../models/Product');
const { success, error } = require('../utils/response');



exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // basic validation
    if (!name || price == null || stock == null) {
      return error(res, 'Name, price and stock are required', 400);
    }

    const product = new Product({
      name,
      description,
      price,
      stock
    });

    await product.save();

    return success(
      res,
      product,
      'Product created successfully',
      201
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};


/////////////
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return error(res, 'Product not found', 404);
    }

    const { price, stock, description, name } = req.body;

    // update only provided fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    return success(
      res,
      product,
      'Product updated successfully'
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};


// ////////
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return success(
      res,
      products,
      'Products fetched successfully'
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};