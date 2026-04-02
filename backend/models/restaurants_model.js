const pool = require('../config/db_config');

const createRestaurantTable = async () => {
      const queryText = `
        CREATE TABLE IF NOT EXISTS restaurants (
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

const getAllRestaurants = async () => {
  const queryText = 'SELECT id, username, email, phone_no, address, profile_pic, created_at FROM restaurants';
  const res = await pool.query(queryText);
  return res.rows;
};

const getRestaurantById = async (id) => {
  const queryText = 'SELECT id, username, email, phone_no, address, profile_pic, created_at FROM restaurants WHERE id = $1';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

const updateRestaurantById = async (id, updates) => {
  const fields = [];
  const values = [id]; 
  let index = 2; 

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  const queryText = `
    UPDATE restaurants 
    SET ${fields.join(', ')} 
    WHERE id = $1 
    RETURNING *`;

  const res = await pool.query(queryText, values);
  return res.rows[0];
};

const deleteRestaurantById = async (id) => {
  const queryText = 'DELETE FROM restaurants WHERE id = $1 RETURNING *';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

const getRestaurantByPhone = async (phone_no) => {
  const queryText = 'SELECT * FROM restaurants where phone_no = $1';
  const res = await pool.query(queryText, [phone_no]);
  return res.rows[0];
}

module.exports = { createRestaurantTable, createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurantById, deleteRestaurantById, getRestaurantByPhone};