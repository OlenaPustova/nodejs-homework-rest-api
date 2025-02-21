const path = require('path');
const fs = require('fs').promises;
const { compressAvatar } = require('../middlewares/compressAvatar');

const {
  registration,
  verification,
  verify,
  login,
  logout,
  currentUser,
  updateAvatar,
} = require('../services/authService');

const registrationController = async (req, res) => {
  const { email, password } = req.body;
  const newUser = await registration(email, password);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};
const verificationController = async (req, res) => {
  const { verificationToken } = req.params;
  await verification(verificationToken);
  res.status(201).json({ message: 'Verification successful' });
};

const verifyController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'missing required field email' });
  }
  await verify(email);
  res.status(200).json({ message: 'Verification email sent' });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await login(email, password);
  res.status(200).json({
    token: loginUser.token,
    user: { email: loginUser.email, subscription: loginUser.subscription },
  });
};

const logoutController = async (req, res) => {
  const { _id } = req.user;
  await logout(_id);
  res.status(204).json();
};

const currentUserController = async (req, res) => {
  const { _id } = req.user;
  const user = await currentUser(_id);
  res.status(200).json({ email: user.email, subscription: user.subscription });
};

const updateAvatarController = async (req, res) => {
  const { _id } = req.user;
  const originalFilePath = req.file.path;
  const newDestination = path.join('./public/avatars');
  const newPath = path.join(newDestination, req.file.filename);

  await compressAvatar(originalFilePath, newPath);

  const user = await updateAvatar(_id, newPath);
  await fs.unlink(originalFilePath);

  res.status(200).json(`avatarURL: ${user.avatarURL}`);
};

module.exports = {
  registrationController,
  verificationController,
  verifyController,
  loginController,
  logoutController,
  currentUserController,
  updateAvatarController,
};
