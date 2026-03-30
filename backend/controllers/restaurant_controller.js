const RestaurantModel = require('../models/restaurants_model');

const handleRestaurantCreation = async (req, res) => {
    const { username, password, email, phone_no, address, profile_pic } = req.body;

    if (!username || !password || !email || !phone_no || !address) {
        return res.status(400).json({
            error: "All fields except Profile_pic is mandatory!"
        });
    }

    try {
        const newRestaurant = await RestaurantModel.createRestaurant({
            username,
            password,
            email,
            phone_no,
            address,
            profile_pic: profile_pic||null
        });

        const { password: _, ...userWithoutPassword } = newRestaurant;

        res.status(201).json({
            message: "Restaurant created successfully!",
            restaurant: newRestaurant
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                error: "Restaurant with this email or phone no already exists."
            });
        }
        console.log("Controller error: ", err);
        res.status(500).json({error: "Something went wrong on the server."})
    }
}

const handleGetAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.getAllRestaurants();

        if (restaurants.length == 0) {
            return res.status(404).json({
                message: "No restaurants found."
            })
        }
        res.status(200).json({
            message: "Restaurants fetched successfully!",
            count: restaurants.length,
            restaurants
        });
    }
    catch (err) {
        console.log("Fetch error: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

const handleRestaurantFetch = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await RestaurantModel.getRestaurantById(id);
        if (!restaurant) {
            return res.status(404).json({
                error: "Restaurant not found!"
            });
        }
        res.status(200).json({
            message: "Restaurant data fetched successfully!",
            restaurant
        });
    } catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ error: "Server error while fetching restaurant." });
    }
};


const handleUpdateRestaurant = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const restaurant = await RestaurantModel.updateRestaurantById(id, updateData);
        if (!restaurant) {
            return res.status(404).json({
                error: "Restaurant not found."
            });
        }
        res.status(200).json({
            message: "Restaurant updated successfully!",
            restaurant
        });
    }
    catch{ err } {
        console.err("Fetch error: ", err)
        res.status(500).json({ message: "Internal Server error." });
    }
}

const handleDeleteRestaurant = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await RestaurantModel.deleteRestaurantById(id);
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found."
            });
        }
        return res.status(200).json({
            message: "Restaurant deleted successfully!",
            restaurant
        });
    }
    catch (err) {
        console.err("Fetch error: ", err);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

module.exports = {handleRestaurantCreation, handleGetAllRestaurants, handleRestaurantFetch, handleUpdateRestaurant, handleDeleteRestaurant };