require('dotenv').config();
const express = require('express');
const { createUserTable } = require('./models/users_model');
const { createRiderTable } = require('./models/riders_model');
const { createRestaurantTable } = require('./models/restaurants_model');
const userRoutes = require('./routes/userRoutes');
const riderRoutes = require('./routes/riderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

createUserTable();
createRiderTable();
createRestaurantTable();

app.use('/api/v1', userRoutes);
app.use('/api/v1', riderRoutes);
app.use('/api/v1', restaurantRoutes);

app.get('/', (req, res) => {
    res.send("Backend server is running!")
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});