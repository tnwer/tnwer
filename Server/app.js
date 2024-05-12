const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
// const payment = require('./Model/payment');
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

//----------------------------------------------------------------------->
// (nodemon app).js ======> to run the server 

// mongoDB Classes ===>
// const user = require('./Model/user');
// const role = require('./Model/role');
// const visa = require('./Model/visaCard');
// const product = require('./Model/product');
// const payment = require('./Model/payment');
// const cart = require('./Model/cart');
// const category = require('./Model/category');
// const discount = require('./Model/discount');
// const wishlist = require('./Model/wishlist');