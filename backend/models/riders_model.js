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

const getAllRiders = async () => {
  const queryText = 'SELECT id, username, email, phone_no, profile_pic, created_at FROM riders';
  const res = await pool.query(queryText);
  return res.rows;
};

const getRiderById = async (id) => {
  const queryText = 'SELECT id, username, email, phone_no, profile_pic, created_at FROM riders WHERE id = $1';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

const updateRiderById = async (id, updates) => {
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
    UPDATE riders 
    SET ${fields.join(', ')} 
    WHERE id = $1 
    RETURNING *`;

  const res = await pool.query(queryText, values);
  return res.rows[0];
};

const deleteRiderById = async (id) => {
  const queryText = 'DELETE FROM riders WHERE id = $1 RETURNING *';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

const getRiderByPhone = async (phone_no) => {
    const queryText = 'SELECT * FROM riders where phone_no = $1';
    const res = await pool.query(queryText, [phone_no]);
    return res.rows[0];
}

module.exports = { createRiderTable, createRider, getAllRiders, getRiderById, updateRiderById, deleteRiderById, getRiderByPhone };