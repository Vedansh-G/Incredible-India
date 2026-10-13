const express = require("express");
const router = express.Router();

const authMiddleware =require("../middleware/authMiddleware");

const {
    createBooking,
    getBooking,
    cancelBooking,
    rescheduleBooking
}
= require("../controllers/bookingController");

router.post(
    "/",
    authMiddleware,
    createBooking
);

router.get(
    "/myBookings",
    authMiddleware,
    getBooking
);

router.put(
    "/:id",
    authMiddleware,
    rescheduleBooking
);

router.delete(
    "/:id",
    authMiddleware,
    cancelBooking
);

module.exports=router;