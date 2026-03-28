require('dotenv').config();
const express = require('express');
const { createUserTable } = require('./models/users_model');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const initDB = async () => {
    try {
        await createUserTable();
        console.log("Database initialized.");
    }
    catch (err) {
        console.log("Database initialization failed!", err);
    }
};
initDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send("Backend server is running!")
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});