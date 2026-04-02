const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const authenticateToken = require('../middleware/auth_middleware');

router.post("/users/signup", userController.handleUserCreation);
router.post("/users/request-otp", userController.requestOTP);
router.post("/users/verify-otp", userController.verifyOTP);
router.get("/users", userController.handleGetAllUsers);
router.get("/users/:id", authenticateToken ,userController.handleUserFetch);
router.put("/update/users/:id", authenticateToken ,userController.handleUpdateUser);
router.delete("/delete/users/:id", authenticateToken, userController.handleDeleteUser);

module.exports = router;