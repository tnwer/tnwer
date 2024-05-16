const express = require('express');
const router = express.Router();
const cartControllers = require('../Controllers/cartController');
const userAuth = require('../Middlewares/userAuth');

router.get('/cart', userAuth.authorize, cartControllers.getCartInfo);
router.post('/cartIncrement/:id', userAuth.authorize, cartControllers.cartIncrement);
router.put('/cartDecrement/:id', userAuth.authorize, cartControllers.cartDecrement);

module.exports = router;