const express = require('express');
const { registerUser, loginUser, logoutUser, subscribe, unsubscribe } = require('../controllers/userController')
const isSignIn = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser);
router.post('logout', logoutUser);
router.post('/subscribe/:id', isSignIn, subscribe);
router.post('/unsubscribe/:id', isSignIn, unsubscribe);

module.exports = router;