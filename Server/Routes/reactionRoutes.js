const express = require('express');
const router = express.Router();
const reactionController = require('../Controllers/reactionController');
const userAuth = require('../Middlewares/userAuth');

router.post('/addRating/:id', userAuth.authorize, reactionController.addRating);
router.post('/addComment/:id', userAuth.authorize, reactionController.addComment);

module.exports = router;