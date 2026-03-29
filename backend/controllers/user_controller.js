const userModel = require('../models/users_model');

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
            counnt: users.length,
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
            message: "User found!",
            user
        });
    } catch (err) {
        console.error("Fetch error: ", err);
        res.status(500).json({ error: "Server error while fetching user." });
    }
};



module.exports = { handleUserCreation, handleUserFetch, handleGetAllUsers };