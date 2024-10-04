const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display details of a specific vehicle
router.get("/vehicle/:vehicleId", invController.displayVehicleDetails); // Certifique-se de que este parâmetro é vehicleId

// Route to trigger a 500 error
router.get('/trigger-error', (req, res) => {
    throw new Error("This is a deliberate error to test error handling."); // This will be caught by your error handler
});

module.exports = router;
