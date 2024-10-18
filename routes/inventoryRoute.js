const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities'); // Verifique se o caminho está correto

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
router.post('/inv/add-classification', invController.processAddClassification);

// Route to add a new inventory item
router.get('/inv/add-inventory', invController.addInventoryView);

// Route to process adding a new inventory item
router.post('/inv/add-inventory', invController.processAddInventory); 

// New route to get inventory based on classification ID
router.get("/inv/getinventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// New route for editing inventory items
// Route to display the edit view for a specific inventory item
router.get("/inv/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView)); // Add the new route

// New route to update an inventory item
// Route to process updating an inventory item
router.post("/inv/update/", utilities.handleErrors(invController.updateInventory)); // Add this new route

module.exports = router;
