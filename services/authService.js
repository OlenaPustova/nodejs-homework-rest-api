const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');

const { Conflict, Unauthorized } = require('http-errors');
const { User } = require('../models/userModel');

const registration = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict('Email in use');
  }

  const avatarURL = gravatar.url(email, {
    s: '200',
    r: 'pg',
    d: '404',
  });
  const newUser = new User({ email, password, avatarURL });
  await newUser.save();
  return newUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthorized(`No user with email ${email}`);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized('Wrong password');
  }
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );
  const loginUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return loginUser;
};

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  const updatedUser = await User.findByIdAndUpdate(id, { token: null });
  return updatedUser;
};

const currentUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  return user;
};

const updateAvatar = async (id, avatarURL) => {
  console.log(id);
  const user = await User.findByIdAndUpdate(
    id,
    { avatarURL: avatarURL },
    { new: true }
  );
  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  return user;
};

module.exports = {
  registration,
  login,
  logout,
  currentUser,
  updateAvatar,
};
