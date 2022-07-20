const express = require('express');
const router = new express.Router();

const { catchErrors } = require('../middlewares/catchErrors');

const {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
} = require('../controllers/authController');

const { newUserSchema } = require('../middlewares/validationMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', newUserSchema, catchErrors(registrationController));
router.post('/login', newUserSchema, catchErrors(loginController));
router.get('/logout', authMiddleware, catchErrors(logoutController));
router.get('/current', authMiddleware, catchErrors(currentUserController));

module.exports = { authRouter: router };
