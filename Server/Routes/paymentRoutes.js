const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');
router.use(express.static("."));

router.get('/create-checkout-session', paymentController.getPayment);
router.get('/afterPayment', paymentController.afterPayment);

router.get('/notResponding', (req, res) => {
    res.send("sorry there is an error");
});

router.get('/paymentHistory', paymentController.OrdersHistory);

module.exports = router;