const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant_controller');

router.post("/add/restaurants", restaurantController.handleRestaurantCreation);
router.get("/restaurants", restaurantController.handleGetAllRestaurants);
router.get("/restaurants/:id", restaurantController.handleRestaurantFetch);
router.put("/update/restaurants/:id", restaurantController.handleUpdateRestaurant);
router.delete("/delete/restaurants/:id", restaurantController.handleDeleteRestaurant);

module.exports = router;