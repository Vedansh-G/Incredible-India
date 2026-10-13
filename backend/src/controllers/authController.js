const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      googleId,
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(
        password,
        10
      );
    }

    // Insert user and get generated user_id
    const insertedUser = await pool.query(
      `
      INSERT INTO users
      (
        username,
        password_hash,
        role,
        google_id
      )
      VALUES($1,$2,$3,$4)
      RETURNING *
      `,
      [
        username,
        hashedPassword,
        role || "Citizen",
        googleId || null,
      ]
    );

    const user = insertedUser.rows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    console.log(username);
    console.log(password);
    console.log(user.password_hash);

    const match =
    await bcrypt.compare(
        password,
        user.password_hash
    );

    console.log(match);
    // User created account using Google
    if (!user.password_hash) {
      return res.status(400).json({
        message:
          "Please login using Google.",
      });
    }


    if (!match) {
      return res.status(401).json({
        message:
          "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
};