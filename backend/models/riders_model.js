const pool = require('../config/db_config')

const createRiderTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS riders (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone_no VARCHAR(15) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          profile_pic TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    try {
        await pool.query(queryText);
        console.log("Riders table verified.");
    } catch (err) {
        console.error("Error creating riders table", err);
    }
};

const createRider = async (rider) => {
    const insertQuery = `
    INSERT INTO riders(username, email, phone_no, password, profile_pic)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const values = [
        rider.username, 
        rider.email, 
        rider.phone_no, 
        rider.password, 
        rider.profile_pic
    ];

    const res = await pool.query(insertQuery, values);
    return res.rows[0]; 
};

module.exports = { createRiderTable, createRider };