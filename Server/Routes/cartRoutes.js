const express = require('express');
const router = express.Router();
const cartControllers = require('../Controllers/cartController');
const userAuth = require('../Middlewares/userAuth');

router.get('/cart', cartControllers.getCartInfo);
router.post('/cartIncrement/:id', cartControllers.cartIncrement);
router.put('/cartDecrement/:id', cartControllers.cartDecrement);

module.exports = router;