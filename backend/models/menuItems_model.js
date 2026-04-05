const pool = require('../config/db_config')

const createMenuTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS menuItems (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description text,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    try {
        await pool.query(queryText);
        console.log("Menu table verified.");
    } catch (err) {
        console.log("Error creating Menu Table", err);
    }
};

const createMenu = async (menuItem) => {
    const insertQuery = `
    INSERT INTO menuItems(restaurant_id, item_name, description, price, category, is_available, image_url)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `

    const values = [
        menuItem.restaurant_id,
        menuItem.item_name,
        menuItem.description,
        menuItem.price,
        menuItem.category,
        menuItem.is_available,
        menuItem.image_url
    ];

    const res = await pool.query(insertQuery, values);
    return res.rows[0];
};

const getMenuByRestaurantId = async (restaurant_id) => {
    const queryText = `
    SELECT * FROM menuItems WHERE restaurant_id = $1 ORDER BY category, item_name
    `;
    const res = await pool.query(queryText, [restaurant_id])
    return res.rows;
};

const updateMenyById = async (id, updates) => {
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

    if (fields.length == 0) return null;

    const queryText = `
    UPDATE menuItems SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING *;
    `;

    const res = await pool.query(queryText, values);
    return res.rows[0];
}

const deleteMenyById = async (id) => {
    const queryText = `
    DELETE FROM menuItems where id = $1 RETURNING *;
    `;

    const res = await pool.query(queryText, [id]);
    return res.rows[0];
}

module.exports = { createMenuTable, createMenu, getMenuByRestaurantId, updateMenyById, deleteMenyById};