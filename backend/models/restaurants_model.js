const pool = require('../config/db_config');

const createRestaurantTable = async () => {
      const queryText = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone_no VARCHAR(15) UNIQUE NOT NULL,
          address VARCHAR(100) NOT NULL,
          password TEXT NOT NULL,
          profile_pic TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      try {
        await pool.query(queryText);
        console.log("Restaurants table verified.");
      } catch (err) {
        console.error("Error creating Restaurants table", err);
      }
    };

const createRestaurant = async (restaurant) => {
    const insertQuery = `
    INSERT INTO restaurants(username, email, phone_no, address, password, profile_pic)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    const values = [
        restaurant.username, 
        restaurant.email, 
        restaurant.phone_no, 
        restaurant.address, 
        restaurant.password, 
        restaurant.profile_pic
    ];

    const res = await pool.query(insertQuery, values);
    return res.rows[0]; 
}

module.exports = { createRestaurantTable, createRestaurant };