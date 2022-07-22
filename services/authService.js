const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { Conflict, Unauthorized, NotFound, BadRequest } = require('http-errors');
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
  const verificationToken = uuid.v4();
  const newUser = new User({ email, password, avatarURL, verificationToken });
  await newUser.save();

  const msg = {
    to: email,
    from: 'testing27112017@gmail.com',
    subject: 'Thank you for registration',
    html: `<h1>Please, <a href="http://localhost:3000/api/users/verify/${verificationToken}">confirm</a> your email address</h1>`,
  };
  await sgMail.send(msg);

  return newUser;
};

const verification = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound('Not found');
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      verificationToken: null,
      verify: true,
    },
    { new: true }
  );
};

const verify = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized('Not authorized');
  }

  if (!user.verificationToken) {
    throw new BadRequest('Verification has already been passed');
  }

  const msg = {
    to: email,
    from: 'testing27112017@gmail.com',
    subject: 'Thank you for registration',
    html: `<h1>Please, <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">confirm</a> your email address</h1>`,
  };
  await sgMail.send(msg);
};

const login = async (email, password) => {
  const user = await User.findOne({ email, verify: true });

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
  verification,
  verify,
  login,
  logout,
  currentUser,
  updateAvatar,
};
