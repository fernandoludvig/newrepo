const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display details of a specific vehicle
router.get("/vehicle/:vehicleId", invController.displayVehicleDetails); 

// Route to trigger a 500 error
router.get('/trigger-error', (req, res) => {
    throw new Error("This is a deliberate error to test error handling.");
});

// Route to display the inventory management view
router.get('/inv/', invController.managementView);

// Route to add a new classification
router.get('/inv/add-classification', invController.addClassificationView);

// Route to process adding a new classification
router.post('/inv/add-classification', invController.processAddClassification); // Check this line

// Route to add a new inventory item
router.get('/inv/add-inventory', invController.addInventoryView);

// Route to process adding a new inventory item
router.post('/inv/add-inventory', invController.processAddInventory); // New line added

module.exports = router;
