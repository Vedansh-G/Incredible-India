const pool = require("../config/db");

const createBooking = async(req,res)=>{
    try{

        const userId =
        req.user.userId;

        const {
            touristId,
            visitDate,
            timeSlot,
            numberOfPeople,
            paymentMethod,
            paymentAmount,
            paymentStatus,
            razorpayOrderId,
            razorpayPaymentId
        } = req.body;

        const tourist =
        await pool.query(
        `
        SELECT *
        FROM touristsite
        WHERE tourist_id=$1
        `,
        [touristId]
        );

        if(tourist.rows.length===0)
        {
            return res.status(404).json({
                message:"Tourist site not found"
            });
        }

        const maxCapacity =tourist.rows[0].max_daily_capacity;
        const bookedPeople =
        await pool.query(
        `
        SELECT COALESCE(
            SUM(number_of_people),
            0
        ) AS total
        FROM booking
        WHERE tourist_id=$1
        AND visit_date=$2
        AND time_slot=$3
        AND booking_status='Booked'
        `,
        [
            touristId,
            visitDate,
            timeSlot
        ]
        );

        const currentBooked =
        Number(
            bookedPeople.rows[0].total
        );

        if(
            currentBooked +
            numberOfPeople >
            maxCapacity
        )
        {
            return res.status(400).json({
                message:"Capacity Exceeded"
            });
        }
        const booking =
        await pool.query(
        `
        INSERT INTO booking
        (
            user_id,
            tourist_id,
            visit_date,
            time_slot,
            number_of_people,
            payment_method,
            payment_amount,
            payment_status,
            razorpay_order_id,
            razorpay_payment_id,
            booking_status
        )
        VALUES
        (
            $1,$2,$3,$4,
            $5,$6,$7,
            $8,$9,$10,
            'Booked'
        )
        RETURNING *
        `,
        [
            userId,
            touristId,
            visitDate,
            timeSlot,
            numberOfPeople,
            paymentMethod,
            paymentAmount,
            paymentStatus,
            razorpayOrderId,
            razorpayPaymentId
        ]
        );

        res.status(201)
        .json(booking.rows[0]);

    }
    catch(err){
        console.log(err);

        res.status(500)
        .json({
            message:"Server Error"
        });
    }
};

const getBooking=async(req,res)=>{
    try{
         const userId =
        req.user.userId;

        const bookings =
        await pool.query(
        `
        SELECT b.*,t.name,t.address,t.category
        FROM booking b
        JOIN touristsite t
        ON b.tourist_id=t.tourist_id
        WHERE b.user_id=$1
        ORDER BY created_at DESC
        `,
        [userId]
        );

        res.json(
            bookings.rows
        );
    }
    catch(err){
        console.log(err);

        res.status(500)
        .json({
            message:"Server Error"
        });
    }
};

const cancelBooking =
async(req,res)=>{

    try{

        const bookingId =
        req.params.id;
        const userId = req.user.userId;

        const booking = await pool.query(
        `
        SELECT *
        FROM booking
        WHERE booking_id=$1
        AND user_id=$2
        `,
        [
            bookingId,
            userId
        ]
        );

        if(booking.rows.length===0)
        {
            return res.status(404).json({
                message:"Booking not found"
            });
        }

        if(
            booking.rows[0].booking_status==="Cancelled"
        )
        {
            return res.status(400).json({
                message:"Booking already cancelled"
            });
        }

        await pool.query(
        `
        INSERT INTO bookinghistory
        (
            booking_id,
            old_date,
            old_time_slot
        )
        SELECT
            booking_id,
            visit_date,
            time_slot
        FROM booking
        WHERE booking_id=$1
        AND user_id=$2
        `,
        [bookingId,userId]
);
        const result=await pool.query(
        `
        UPDATE booking
        SET booking_status='Cancelled'
        WHERE booking_id=$1
        AND user_id=$2
        AND booking_status!='Cancelled'
        `,
        [bookingId,userId]
        );

        

        if(result.rowCount===0)
        {
            return res.status(404).json({
                message:"Booking not found"
            });
        }
        res.json({
            message:
            "Booking Cancelled"
        });

    }
    catch(err){
        console.log(err);

        res.status(500)
        .json({
            message:"Server Error"
        });
    }
};

const rescheduleBooking =
async(req,res)=>{

    try{

        const bookingId =
        req.params.id;
        const userId=req.user.userId;
        const {
            visitDate,
            timeSlot
        } = req.body;

        const bookingDetails=await pool.query(
            `SELECT tourist_id,number_of_people
            FROM booking
            WHERE booking_id=$1
            AND user_id=$2`,[bookingId,userId]
        );

        if(bookingDetails.rows.length===0)
        {
            return res.status(404).json({
                message:"Booking not found"
            });
        }

        const touristId =bookingDetails.rows[0].tourist_id;
        const peopleCount =bookingDetails.rows[0].number_of_people;

        const tourist = await pool.query(
            `
            SELECT max_daily_capacity
            FROM touristsite
            WHERE tourist_id=$1
            `,
            [touristId]
        );

        const maxCapacity =tourist.rows[0].max_daily_capacity;
        const numberInNewSlot=await pool.query(
            `SELECT COALESCE(
            SUM(number_of_people),0
            ) AS total
            FROM booking
            WHERE tourist_id=$1
            AND visit_date=$2
            AND time_slot=$3
            AND booking_status='Booked'
            AND booking_id!=$4
            `,[touristId,visitDate,timeSlot,bookingId]
        );

        const currentBooked =Number(numberInNewSlot.rows[0].total);
        if(currentBooked+peopleCount>maxCapacity)
        {
            return res.status(400).json({
                message:"Capacity Exceeded"
            });
        }
        await pool.query(
        `
        INSERT INTO bookinghistory
        (
            booking_id,
            old_date,
            old_time_slot
        )
        SELECT
            booking_id,
            visit_date,
            time_slot
        FROM booking
        WHERE booking_id=$1
        AND user_id=$2
        AND booking_status!='Cancelled'
        `,
        [bookingId,userId]
        );
        const result=await pool.query(
        `
        UPDATE booking
        SET
        visit_date=$1,
        time_slot=$2
        WHERE booking_id=$3
        AND user_id=$4
        AND booking_status!='Cancelled'
        `,
        [
            visitDate,
            timeSlot,
            bookingId,
            userId,
        ]
        );
        if(result.rowCount===0)
        {
            return res.status(404).json({
                message:"Booking not found"
            });
        }
        res.json({
            message:
            "Booking Updated"
        });

        
    }
    catch(err){
        console.log(err);

        res.status(500)
        .json({
            message:"Server Error"
        });
    }
};

module.exports={
    createBooking,
    getBooking,
    cancelBooking,
    rescheduleBooking
};