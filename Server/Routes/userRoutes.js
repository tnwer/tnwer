const express = require('express');
const router = express.Router();
const userControllers = require('../Controllers/userController');
const userAuth = require('../Middlewares/userAuth');
const uploadImg = require('../Middlewares/imgUpload');

router.post('/userLogin', userControllers.createUser);
router.post('/userRegister', userControllers.loginUser)
router.get('/allUsers', userControllers.getAllUsers);
router.get('/profilePage', userControllers.getUserData);
router.get('/activeUsers', userControllers.getActiveUsers);
router.put('/updateUser/:id',uploadImg.uploadImg, userControllers.updateUserData);
router.put('/deleteUser/:id', userControllers.deleteUser);

router.get('/wishlist', userControllers.getWishist);
router.post('/addToWishlist/:id', userControllers.addToWishlist);
router.delete('/deleteFromWishlist/:id', userControllers.deleteFromWishlist);


module.exports = router;