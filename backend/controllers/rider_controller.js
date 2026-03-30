const riderModel = require('../models/riders_model');

const handleRiderCreation = async (req, res) => {
    const { username, password, email, phone_no, profile_pic } = req.body;

    if (!username || !password || !email || !phone_no) {
        return res.status(400).json({
            error: "All fields except Profile_pic is mandatory!"
        });
    }

    try {
        const newRider = await riderModel.createRider({
            username,
            password,
            email,
            phone_no,
            profile_pic: profile_pic||null
        });

        const { password: _, ...riderWithoutPassword } = newRider;

        res.status(201).json({
            message: "Rider created successfully!",
            rider: newRider
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                error: "Rider with this email or phone no already exists."
            });
        }
        console.log("Controller error: ", err);
        res.status(500).json({error: "Something went wrong on the server."})
    }
}

const handleGetAllRiders = async (req, res) => {
    try {
        const riders = await riderModel.getAllRiders();

        if (riders.length == 0) {
            return res.status(404).json({
                message: "No riders found."
            })
        }
        res.status(200).json({
            message: "Riders fetched successfully!",
            count: riders.length,
            riders
        });
    }
    catch (err) {
        console.log("Fetch error: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

const handleRiderFetch = async (req, res) => {
    const { id } = req.params;

    try {
        const rider = await riderModel.getRiderById(id);
        if (!rider) {
            return res.status(404).json({
                error: "Rider not found!"
            });
        }
        res.status(200).json({
            message: "Rider data fetched successfully!",
            rider
        });
    } catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ error: "Server error while fetching rider." });
    }
};


const handleUpdateRider = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const rider = await riderModel.updateRiderById(id, updateData);
        if (!rider) {
            return res.status(404).json({
                error: "Rider not found."
            });
        }
        res.status(200).json({
            message: "Rider updated successfully!",
            rider
        });
    }
    catch(err) {
        console.error("Fetch error: ", err)
        res.status(500).json({ message: "Internal Server error." });
    }
}

const handleDeleteRider = async (req, res) => {
    const { id } = req.params;

    try {
        const rider = await riderModel.deleteRiderById(id);
        if (!rider) {
            return res.status(404).json({
                message: "Rider not found."
            });
        }
        return res.status(200).json({
            message: "Rider deleted successfully!",
            user
        });
    }
    catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

module.exports = { handleRiderCreation, handleGetAllRiders, handleRiderFetch, handleUpdateRider, handleDeleteRider };