const cartModel = require('../Model/cart');
const paymentModel = require('../Model/payment');
const productModel = require('../Model/product');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function OrdersHistory(req, res){
    try {
        const userID = req.user.id;
        const payments = await paymentModel.find().where({
             payment_user_id: userID 
            }).populate({
                path: 'product_id', // Populate the product_id field within payment_products array
                model: 'Product' // Name of the referenced model
            });
        res.status(200).json(payments); 
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Error in Orders History controller'});
    }
};

async function getPayment(req, res){
    try{
        const userID = req.user.id;
        const allOrders = await cartModel.find().where({
            cart_user_id: userID,
            is_deleted: false,
            is_payed: false,
        });
        let total = 0;
        let items = [];
        if(allOrders.length == 0){
            res.status(200).json("there is no products in the cart");
        }else{
            for (let i = 0; i < allOrders.length; i++){
                let theProduct = await productModel.findById(allOrders[i].cart_product);
                total = total + (theProduct.price * allOrders[i].quantity);
                items.push({
                    price_data : {
                        currency : "usd",
                        product_data : {
                            name : `${theProduct.product_name}`,
                            images : [theProduct.img_url],
                            description : `${theProduct.description}`,
                        },
                        unit_amount : `${theProduct.price}00`,
                    },
                    quantity: allOrders[i].quantity,
                })
            };
            const successUrl = `http://localhost:8080/afterPayment?orderIds=${allOrders.map(order => order._id).join(',')}&total=${total}&userID=${userID}`;
            const cancelUrl = `http://localhost:8080/notResponding`;
            const session = await stripe.checkout.sessions.create({
                line_items : items,
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
          res.send(session.url);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'error in payment controller'})
    }
};

async function afterPayment(req, res){
    try{
        const orderIds = req.query.orderIds.split(',');
        const userID = req.query.userID;
        const total = req.query.total;
        const orders = await cartModel.find({ _id: { $in: orderIds } });

        // console.log(222222,orders);

        // Prepare payment products array
        const paymentProducts = orders.map(order => ({
            product_id: order.cart_product, // Assuming you have product_id in your cart
            quantity: order.quantity // Assuming you have quantity in your cart
        }));

        // Update orders to mark them as paid and deleted
        for(let i = 0; i < orders.length; i++){
            orders[i].is_deleted = true;
            orders[i].is_payed = true;
            await orders[i].save();
        };

        // console.log(111111,paymentProducts);
        // Create payment record
        for(let i = 0; i < orders.length; i++){
            const payment = await paymentModel.create({
                payment_At: new Date(),
                payment_user_id: userID,
                product_id: paymentProducts[i].product_id,
                quantity: paymentProducts[i].quantity,
                total: total,
            });
            await payment.save();
        }
        res.redirect('http://localhost:3000/');
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'error in homepage router'});
    }
};

module.exports = {
    getPayment,
    OrdersHistory,
    afterPayment,
};