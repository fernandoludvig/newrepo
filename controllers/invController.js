const invModel = require("../models/inventory-model"); // Import inventory model
const utilities = require("../utilities/"); // Import utility functions

const invCont = {}; // Create an empty object for the controller

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId; // Get classification ID from URL parameters
  const data = await invModel.getInventoryByClassificationId(classification_id); // Fetch inventory data based on classification ID
  const grid = await utilities.buildClassificationGrid(data); // Build the HTML grid of vehicles
  let nav = await utilities.getNav(); // Get navigation HTML
  const className = data[0].classification_name; // Get the classification name from the data
  res.render("./inventory/classification", { // Render the classification view with the title, nav, and grid
    title: className + " vehicles",
    nav,
    grid,
  });
};



// Export the inventory controller
module.exports = invCont;
