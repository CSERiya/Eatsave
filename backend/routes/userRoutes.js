const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const authenticateToken = require('../middleware/auth_middleware');

router.post("/signup", userController.handleUserCreation);
router.post("/request-otp", userController.requestOTP);
router.post("/verify-otp", userController.verifyOTP);
router.get("/users", userController.handleGetAllUsers);
router.get("/users/:id", authenticateToken ,userController.handleUserFetch);
router.put("/update/users/:id", authenticateToken ,userController.handleUpdateUser);
router.delete("/delete/users/:id", authenticateToken, userController.handleDeleteUser);

module.exports = router;