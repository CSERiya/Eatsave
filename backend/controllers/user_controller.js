const userModel = require('../models/users_model');
const redisclient = require('../config/redis_config');
const { sendSMS, otp } = require('../utils/sms_helper');
const jwt = require('jsonwebtoken');

const handleUserCreation = async (req, res) => {
    const { username, password, email, phone_no, address, profile_pic } = req.body;

    if (!username || !password || !email || !phone_no || !address) {
        return res.status(400).json({
            error: "All fields except Profile_pic is mandatory!"
        });
    }

    try {
        const newUser = await userModel.createUser({
            username,
            password,
            email,
            phone_no,
            address,
            profile_pic: profile_pic||null
        });

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: "User created successfully!",
            user: newUser
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                error: "User with this email or phone no already exists."
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
        console.log(otp);
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

        const user = userModel.getUserByPhone(phone_no);
        if (!user) {
            return res.status(200).json({
                newUser: true,
                message: "OTP verified. Please complete your registration.",
                phone_no: phone_no
            });
        }

        const token = jwt.sign(
            {
                id: user.id, username: user.username
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: user
        });
    }
    catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Verification process failed!" });
    }
};

const handleGetAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        if (users.length == 0) {
            return res.status(404).json({
                message: "No users found."
            })
        }
        res.status(200).json({
            message: "Users fetched successfully!",
            count: users.length,
            users
        });
    }
    catch (err) {
        console.log("Fetch error: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

const handleUserFetch = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.getUserById(id);
        if (!user) {
            return res.status(404).json({
                error: "User not found!"
            });
        }
        res.status(200).json({
            message: "User data fetched successfully!",
            user
        });
    } catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ error: "Server error while fetching user." });
    }
};


const handleUpdateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const user = await userModel.updateUserById(id, updateData);
        if (!user) {
            return res.status(404).json({
                error: "User not found."
            });
        }
        res.status(200).json({
            message: "User updated successfully!",
            user
        });
    }
    catch{ err } {
        console.err("Fetch error: ", err)
        res.status(500).json({ message: "Internal Server error." });
    }
}

const handleDeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.deleteUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        return res.status(200).json({
            message: "User deleted successfully!",
            user
        });
    }
    catch (err) {
        console.err("Fetch error: ", err);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

module.exports = { handleUserCreation, handleUserFetch, handleGetAllUsers, handleUpdateUser, handleDeleteUser, requestOTP, verifyOTP };