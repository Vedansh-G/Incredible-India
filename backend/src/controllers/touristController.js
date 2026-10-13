const pool = require("../config/db");

const getAllTourists =
async(req,res)=>{

    try{

        const tourists =
        await pool.query(
        `
        SELECT *
        FROM touristsite
        ORDER BY category,name
        `
        );

        res.json(
            tourists.rows
        );

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });
    }
};


const getTouristById =
async(req,res)=>{

    try{
        console.log(req.params.id);
        const touristId =
        req.params.id;
        
        const tourist =
        await pool.query(
        `
        SELECT *
        FROM touristsite
        WHERE tourist_id=$1
        `,
        [touristId]
        );

        if(
            tourist.rows.length===0
        ){
            return res.status(404)
            .json({
                message:
                "Tourist Site Not Found"
            });
        }

        res.json(
            tourist.rows[0]
        );

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });
    }
};

module.exports={
    getAllTourists,
    getTouristById
};