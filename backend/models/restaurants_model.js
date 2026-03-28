const pool = require('../config/db_config');

const createRestaurant = async (restaurants) => {
    const insertQuery = `
    INSERT INTO restaurants(username, password, email, phone_no, address, profile_pic)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

    const values = [restaurants.username, restaurants.password, restaurants.email, restaurants.phone_no, restaurants.address, restaurants.profile_pic];
    try {
        const res = await pool.query(insertQuery, values);
        return res.rows[0];
    }
    catch (err) {
        console.log("Error creating restaurant: ", err);
        throw err;
    }
};

module.exports = { createRestaurant };