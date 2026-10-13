const express =require("express");

const router =express.Router();

const {
    getAllTourists,
    getTouristById
}
=
require(
"../controllers/touristController"
);

router.get(
    "/",
    getAllTourists
);

router.get(
    "/:id",
    getTouristById
);

module.exports=router;