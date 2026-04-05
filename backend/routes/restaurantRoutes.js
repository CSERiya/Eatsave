const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant_controller');
const authenticateToken = require('../middleware/auth_middleware');

router.post("/restaurants/signup", restaurantController.handleRestaurantCreation);
router.post("/restaurants/request-otp", restaurantController.requestOTP);
router.post("/restaurants/verify-otp", restaurantController.verifyOTP);
router.get("/restaurants", restaurantController.handleGetAllRestaurants);
router.get("/restaurants/:id", authenticateToken, restaurantController.handleRestaurantFetch);
router.get("/restaurants/menu/:id", authenticateToken, restaurantController.handleGetRestaurantMenu);
router.put("/update/restaurants/:id", authenticateToken, restaurantController.handleUpdateRestaurant);
router.delete("/delete/restaurants/:id", authenticateToken, restaurantController.handleDeleteRestaurant);

module.exports = router;