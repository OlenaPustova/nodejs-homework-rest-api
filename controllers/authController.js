const {
  registration,
  login,
  logout,
  currentUser,
} = require('../services/authService');

const registrationController = async (req, res) => {
  const { email, password } = req.body;
  const newUser = await registration(email, password);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
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

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
};
