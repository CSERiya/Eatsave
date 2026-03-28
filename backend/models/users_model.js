const pool = require('../config/db_config');

const createUser = async (user) => {
    const insertQuery = `
    INSERT INTO users(username, email, password, phone_no, address, profile_pic)
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING *;
    `;

    const values = [user.username, user.email, user.password, user.phone_no, user.assress, user.profile_pic];
    try {
        const res = await pool.query(insertQuery, values);
        return res.rows[0];
    }
    catch (err) {
        console.log("Error inserting user:", err);
        throw err;
    }
};

module.exports = { createUser };