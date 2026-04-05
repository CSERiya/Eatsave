const RestaurantModel = require('../models/restaurants_model');
const redisclient = require('../config/redis_config');
const { sendSMS, otp } = require('../utils/sms_helper');
const jwt = require('jsonwebtoken');

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

const requestOTP = async (req, res) => {
    const { phone_no } = req.body;
    if (!phone_no) return res.status(400).json({ error: "Phone number required." });

    try {
        await redisclient.set(`OTP:${phone_no}`, otp, { EX: 300 });

        console.log(`Sending OTP ${otp} to ${phone_no}`);
        await sendSMS(phone_no, otp);
        res.status(200).json({ message: "OTP sent successfully!" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to send OTP." });
    }
};

const verifyOTP = async (req, res) => {
    const { phone_no, otp } = req.body;

    try {
        const cachedOTP = await redisclient.get(`OTP:${phone_no}`);
        if (!cachedOTP || cachedOTP !== otp) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }

        await redisclient.del(`OTP:${phone_no}`);

        const restaurant = await RestaurantModel.getRestaurantByPhone(phone_no);
        if (!restaurant) {
            return res.status(200).json({
                newRestaurant: true,
                message: "OTP verified. Please complete your registration.",
                phone_no: phone_no
            });
        }

        const token = jwt.sign(
            {
                id: restaurant.id, username: restaurant.username
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            restaurant: restaurant
        });
    }
    catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Verification process failed!" });
    }
};


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

const handleGetRestaurantMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await RestaurantModel.getRestaurantWithMenu(id);

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found."
            });
        }

        const restaurantData = {
            id: rows[0].id,
            username: rows[0].username,
            address: rows[0].address,
            profile_pic: rows[0].profile_pic,
            menu: rows[0].item_name ? rows.map(row => ({
                item_name: row.item_name,
                price: row.price,
                category: row.category
            })) : []
        };

        return res.status(200).json({
            message: "Menu fetched successfully!",
            restaurant: restaurantData
        });
    }
    catch (err) {
        console.log("Fetch error: ", err);
        res.status(500).json({message: "Internal Server Error."})
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

module.exports = {handleRestaurantCreation, handleGetAllRestaurants, handleRestaurantFetch, handleUpdateRestaurant, handleDeleteRestaurant, requestOTP, verifyOTP, handleGetRestaurantMenu };