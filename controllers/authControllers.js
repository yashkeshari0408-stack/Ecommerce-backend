const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/response');


exports.signup = async (req, res) => {
  try {
    const { name,email, password, role } = req.body;

  
    if (!name ||!email || !password) {
      return error(res, 'Name,Email and password are required', 400);
    }
    if (role && !['admin', 'customer'].includes(role)) {
  return error(res, 'Invalid role', 400);
}
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'User already exists', 409);
    }

   
    const hashedPassword = await bcrypt.hash(password, 10); //hashing

  
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // sending response
    return success(
      res,
      {
        token,
        user: {
          id: user._id,
          name:user.name,
          email: user.email,
          role: user.role
        }
      },
      'User registered successfully',
      201
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};

//////////////////////////

exports.login = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 'User not found', 404);
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 401);
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // send response
    return success(
      res,
      {
        token,
        user: {
          id: user._id,
          name:user.name,
          email: user.email,
          role: user.role
        }
      },
      'Login successful'
    );

  } catch (err) {
    return error(res, err.message, 500);
  }
};