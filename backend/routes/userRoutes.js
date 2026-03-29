const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.post("/addUsers", userController.handleUserCreation);
router.get("/getallUsers", userController.handleGetAllUsers);
router.get("/getUser/:id", userController.handleUserFetch);

module.exports = router;