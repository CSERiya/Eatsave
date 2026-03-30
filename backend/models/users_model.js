const pool = require('../config/db_config');

const createUserTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
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
    console.log("Users table verified.");
  } catch (err) {
    console.error("Error creating users table", err);
  }
};

const createUser = async (user) => {
    const insertQuery = `
    INSERT INTO users(username, email, phone_no, address, password, profile_pic)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    const values = [
        user.username, 
        user.email, 
        user.phone_no, 
        user.address, 
        user.password, 
        user.profile_pic
    ];

    const res = await pool.query(insertQuery, values);
    return res.rows[0]; 
};

const getAllUsers = async () => {
  const queryText = 'SELECT id, username, email, phone_no, address, profile_pic, created_at FROM users';
  const res = await pool.query(queryText);
  return res.rows;
};

const getUserById = async (id) => {
  const queryText = 'SELECT id, username, email, phone_no, address, profile_pic, created_at FROM users WHERE id = $1';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

const updateUserById = async (id, updates) => {
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
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE id = $1 
    RETURNING *`;

  const res = await pool.query(queryText, values);
  return res.rows[0];
};

const deleteUserById = async (id) => {
  const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const res = await pool.query(queryText, [id]);
  return res.rows[0];
}

module.exports = { createUserTable, createUser, getAllUsers, getUserById, updateUserById, deleteUserById };

