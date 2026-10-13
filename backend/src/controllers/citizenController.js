const pool =
require("../config/db");

const registerCitizen =
async(req,res)=>{

    try{

        const userId =
        req.user.userId;

        const {
            name,
            phone,
            dob,
            nationality,
            aadhaarNo,
            panNo,
            passportNo,
            aadhaarDoc,
            panDoc,
            passportDoc
        } = req.body;

        const existing =
        await pool.query(
        `
        SELECT *
        FROM citizens
        WHERE user_id=$1
        `,
        [userId]
        );

        if(existing.rows.length>0)
        {
            return res
            .status(400)
            .json({
                message:
                "Already Registered"
            });
        }

        await pool.query(
        `
        INSERT INTO citizens
        (
            user_id,
            name,
            phone,
            dob,
            nationality,
            aadhaar_no,
            pan_no,
            passport_no,
            aadhaar_doc,
            pan_doc,
            passport_doc,
            is_verified
        )
        VALUES
        (
            $1,$2,$3,$4,
            $5,$6,$7,$8,
            $9,$10,$11,
            false
        )
        `,
        [
            userId,
            name,
            phone,
            dob,
            nationality,
            aadhaarNo,
            panNo,
            passportNo,
            aadhaarDoc,
            panDoc,
            passportDoc
        ]
        );

        res.json({
            message:
            "Registration Successful"
        });

    }
    catch(err)
    {
        console.log(err);

        res.status(500)
        .json({
            message:
            "Server Error"
        });
    }
};

const getCitizen =
async(req,res)=>{

    try{

        const userId =
        req.user.userId;

        const citizen =
        await pool.query(
        `
        SELECT *
        FROM citizens
        WHERE user_id=$1
        `,
        [userId]
        );

        if(
            citizen.rows.length===0
        )
        {
            return res
            .status(404)
            .json({
                registered:false
            });
        }

        res.json({
            registered:true,
            citizen:
            citizen.rows[0]
        });

    }
    catch(err)
    {
        console.log(err);

        res.status(500)
        .json({
            message:
            "Server Error"
        });
    }
};

module.exports={
    registerCitizen,
    getCitizen
};