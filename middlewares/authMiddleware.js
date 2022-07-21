const jwt = require('jsonwebtoken');
const { Unauthorized } = require('http-errors');
const { User } = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [tokenType, token] = req.headers.authorization.split(' ');
    if (!token) {
      next(new Unauthorized('Not authorized. no token'));
    }

    const { _id } = jwt.decode(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id });

    if (user.token !== token) {
      next(new Unauthorized('Not authorized'));
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized('Invalid token'));
  }
};

module.exports = {
  authMiddleware,
};
