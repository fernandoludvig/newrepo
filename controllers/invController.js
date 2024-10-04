const invModel = require("../models/inventory-model"); // Import inventory model
const utilities = require("../utilities/"); // Import utility functions

const invCont = {}; // Create an empty object for the controller

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId; // Get classification ID from URL parameters
    const data = await invModel.getInventoryByClassificationId(classification_id); // Fetch inventory data based on classification ID
    
    // Check if data is retrieved
    if (!data || data.length === 0) {
        return res.status(404).send("No vehicles found for this classification.");
    }

    const grid = await utilities.buildClassificationGrid(data); // Build the HTML grid of vehicles
    let nav = await utilities.getNav(); // Get navigation HTML
    const className = data[0].classification_name; // Get the classification name from the data

    res.render("./inventory/classification", { // Render the classification view with the title, nav, and grid
        title: className + " vehicles",
        nav,
        grid,
    });
};

/* ***************************
 *  Display details of a specific vehicle
 * ************************** */
/* ***************************
 *  Display details of a specific vehicle
 * ************************** */
/* ***************************
 *  Display details of a specific vehicle
 * ************************** */
// Controller function to display vehicle details
invCont.displayVehicleDetails = async (req, res) => {
  try {
      const vehicleId = req.params.vehicleId; // Corrigido: use vehicleId
      const vehicleData = await invModel.getVehicleById(vehicleId); // Corrigido: use vehicleId aqui

      // Log the vehicle data in a readable JSON format
      console.log("Vehicle Data:", JSON.stringify(vehicleData, null, 2)); 

      if (!vehicleData) {
          return res.status(404).send("Vehicle not found");
      }

      // Renderize a view EJS com o título
      res.render("./inventory/vehicleDetail", {
          title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, // Defina o título aqui
          vehicle: vehicleData
      });
  } catch (error) {
      console.error("Error fetching vehicle details:", error);
      res.status(500).send("Server error");
  }
};




// Export the inventory controller
module.exports = invCont;
