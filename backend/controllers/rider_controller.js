const riderModel = require('../models/riders_model');
const redisclient = require('../config/redis_config');
const { sendSMS, otp } = require('../utils/sms_helper');
const jwt = require('jsonwebtoken');

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

        const rider = await riderModel.getRiderByPhone(phone_no);
        if (!rider) {
            return res.status(200).json({
                newRider: true,
                message: "OTP verified. Please complete your registration.",
                phone_no: phone_no
            });
        }

        const token = jwt.sign(
            {
                id: rider.id, username: rider.username
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            rider: rider
        });
    }
    catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Verification process failed!" });
    }
};


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
            rider
        });
    }
    catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

module.exports = { handleRiderCreation, handleGetAllRiders, handleRiderFetch, handleUpdateRider, handleDeleteRider, requestOTP, verifyOTP };