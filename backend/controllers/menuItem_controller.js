const menuModel = require('../models/menuItems_model');

const handleMenuListCreation = async (req, res) => {
    const {restaurant_id , item_name, description, price, category, is_available, image_url } = req.body;

    if (!restaurant_id || !item_name || !price || !category || is_available == undefined) {
        return res.status(400).json({
            error: "All fields except description and image is mandatory!"
        });
    }

    try {
        const newMenu = await menuModel.createMenu({
            restaurant_id,
            item_name,
            description: description || null,
            price,
            category,
            is_available,
            image_url: image_url||null
        });

        res.status(201).json({
            message: "Menu added successfully!",
            menu: newMenu
        });
    }
    catch (err) {
        console.error("Controller error: ", err);

       if (err.code === '23503') { 
            return res.status(404).json({ error: "That restaurant does not exist." });
        }

        if (err.code === '23505') {
            return res.status(409).json({ error: "This item already exists on your menu." });
        }

        res.status(500).json({ error: "Something went wrong on the server." });
    }
}

module.exports = { handleMenuListCreation };