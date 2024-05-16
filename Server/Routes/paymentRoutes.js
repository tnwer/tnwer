const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');
const userAuth = require('../Middlewares/userAuth');
router.use(express.static("."));

router.get('/create-checkout-session', userAuth.authorize, paymentController.getPayment);
router.get('/afterPayment', paymentController.afterPayment);

router.get('/notResponding', (req, res) => {
    res.send("sorry there is an error");
});

router.get('/paymentHistory', userAuth.authorize, paymentController.OrdersHistory);

module.exports = router;