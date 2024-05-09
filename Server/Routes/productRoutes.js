const express = require('express');
const router = express.Router();
const productControllers = require('../Controllers/productsController');
const userAuth = require('../Middlewares/userAuth');
const uploadImg = require('../Middlewares/imgUpload');

router.post('/addProduct', uploadImg.uploadImg, productControllers.addProduct);
router.get('/allProducts', productControllers.getAllProducts);
router.get('/productDetails/:id', productControllers.getProductDetails);
router.put('/updateProduct/:id',uploadImg.uploadImg, productControllers.updateProduct);
router.put('/deleteProduct/:id', productControllers.deleteProduct);
router.post('/addDiscount/:id', productControllers.addDiscount);
router.put('/deleteDescount/:id', productControllers.deleteDiscount);

module.exports = router;