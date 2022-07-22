const express = require('express');
const router = new express.Router();

const { catchErrors } = require('../middlewares/catchErrors');

const {
  registrationController,
  verificationController,
  verifyController,
  loginController,
  logoutController,
  currentUserController,
  updateAvatarController,
} = require('../controllers/authController');

const { newUserSchema } = require('../middlewares/validationMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadMiddleware } = require('../middlewares/uploadMiddleware');

router.post('/register', newUserSchema, catchErrors(registrationController));
router.get('/verify/:verificationToken', catchErrors(verificationController));
router.post('/verify', catchErrors(verifyController));
router.post('/login', newUserSchema, catchErrors(loginController));
router.get('/logout', authMiddleware, catchErrors(logoutController));
router.get('/current', authMiddleware, catchErrors(currentUserController));
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  catchErrors(updateAvatarController)
);

module.exports = { authRouter: router };
