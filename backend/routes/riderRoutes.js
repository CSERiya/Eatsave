const express = require('express')
const router = express.Router();
const RiderController = require('../controllers/rider_controller');
const authenticateToken = require('../middleware/auth_middleware');

router.post("/riders/signup", RiderController.handleRiderCreation);
router.post("/riders/request-otp", RiderController.requestOTP);
router.post("/riders/verify-otp", RiderController.verifyOTP);
router.get("/riders", RiderController.handleGetAllRiders);
router.get("/riders/:id", authenticateToken, RiderController.handleRiderFetch);
router.put("/update/riders/:id", authenticateToken, RiderController.handleUpdateRider);
router.delete("/delete/riders/:id", authenticateToken, RiderController.handleDeleteRider);

module.exports = router;

