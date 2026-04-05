const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuItem_controller');
const authenticateToken = require('../middleware/auth_middleware');

router.post("/restaurant/menus", menuController.handleMenuListCreation);

module.exports = router;