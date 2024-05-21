const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const logger = require('./log/logger');
const routes = require('./Routes/routes');

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use(routes.productRoutes);
app.use(routes.userRoutes);
app.use(routes.cartRoutes);
app.use(routes.reactionroutes);
app.use(routes.paymentRoutes);

mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});




















//==========================================>
// (nodemon app).js ======> to run the server 

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => logger.info('Connected to MongoDB'))
//   .catch((error) => console.error('MongoDB connection error:', error));

// mongoDB Classes ==========================>
// const user = require('./Model/user');
// const role = require('./Model/role');
// const visa = require('./Model/visaCard');
// const product = require('./Model/product');
// const payment = require('./Model/payment');
// const cart = require('./Model/cart');
// const category = require('./Model/category');
// const discount = require('./Model/discount');
// const wishlist = require('./Model/wishlist');
// const comment = require('./Model/comment');
// const rating = require('./Model/rating');
