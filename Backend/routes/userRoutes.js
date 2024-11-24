const express = require('express');
const { registerUser, loginUser, logoutUser, subscribe, unsubscribe, fetchUserData } = require('../controllers/userController')
const isSignIn = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser);
router.post('logout', logoutUser);

//subscribe
router.post('/subscribe/:userId', isSignIn, subscribe);
//unsubscribe
router.post('/unsubscribe/:userId', isSignIn, unsubscribe);

//get user data by userId
router.get('/users/:userId', fetchUserData);

module.exports = router;