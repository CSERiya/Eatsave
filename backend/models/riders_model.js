const pool = require('../config/db_config')

const createRider = async (riders) => {
    const insertQuery= `
    INSERT INTO riders(username, password, email, phone_no, profile_pic)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;

    const values = [riders.username, riders.password, riders.email, riders.phone_no, riders.profile_pic];
    try {
        const res = await pool.query(insertQuery, values);
        return res.rows[0];
    }
    catch (err) {
        console.log("Error in creating rider: ", err);
        throw err;
    }
}
module.exports = { createRider };