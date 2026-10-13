const razorpay =require("../config/razorpay");

const createOrder =
async(req,res)=>{

    try{

        const {
            amount
        } = req.body;

        const options = {

            amount:
            amount * 100,

            currency:"INR",

            receipt:
            `receipt_${Date.now()}`
        };

        const order =
        await razorpay.orders.create(
            options
        );

        res.json(order);
    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:
            "Payment Failed"
        });
    }
};

module.exports = {
    createOrder
};