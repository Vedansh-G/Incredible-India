const crypto = require("crypto");

const verifyPayment = async(req,res)=>{
    try{

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if(
            expectedSignature ===
            razorpay_signature
        ){
            return res.json({
                success:true
            });
        }

        return res.status(400).json({
            success:false,
            message:"Payment verification failed"
        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

module.exports = { verifyPayment };