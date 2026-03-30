const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.post("/add/users", userController.handleUserCreation);
router.get("/users", userController.handleGetAllUsers);
router.get("/users/:id", userController.handleUserFetch);
router.put("/update/users/:id", userController.handleUpdateUser);
router.delete("/delete/users/:id", userController.handleDeleteUser);

module.exports = router;