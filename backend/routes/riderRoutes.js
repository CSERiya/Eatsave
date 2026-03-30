const express = require('express')
const router = express.Router();
const RiderController = require('../controllers/rider_controller');

router.post("/add/riders", RiderController.handleRiderCreation);
router.get("/riders", RiderController.handleGetAllRiders);
router.get("/riders/:id", RiderController.handleRiderFetch);
router.put("/update/riders/:id", RiderController.handleUpdateRider);
router.delete("/delete/riders/:id", RiderController.handleDeleteRider);

module.exports = router;

