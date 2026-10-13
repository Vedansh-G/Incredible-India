const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    registerCitizen
} = require("../controllers/citizenController");

const {
    getCitizen
} = require("../controllers/citizenController");

router.post(
    "/register",
    authMiddleware,
    registerCitizen
);

router.get(
    "/me",
    authMiddleware,
    getCitizen
);

module.exports = router;