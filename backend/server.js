const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const app = express();

const authRoutes =require("./src/routes/authRoutes");

const citizenRoutes =require("./src/routes/citizenRoutes");

const bookingRoutes =require("./src/routes/bookingRoutes");

const touristRoutes =require("./src/routes/touristRoutes");

const paymentRoutes =require("./src/routes/paymentRoutes");

const verificationRoutes =require("./src/routes/verificationRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/citizens",citizenRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/tourists",touristRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/payment",verificationRoutes);

pool.connect()
.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Tourism API Running");
});

app.listen(
    process.env.PORT,
    () => {
        console.log(
            `Server running on port ${process.env.PORT}`
        );
    }
);