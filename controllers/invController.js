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
invCont.displayVehicleDetails = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId; // Use vehicleId parameter
        const vehicleData = await invModel.getVehicleById(vehicleId); // Fetch vehicle details by ID

        console.log("Vehicle Data:", JSON.stringify(vehicleData, null, 2)); 

        if (!vehicleData) {
            return res.status(404).send("Vehicle not found");
        }

        res.render("./inventory/vehicleDetail", {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, // Set the title dynamically
            vehicle: vehicleData
        });
    } catch (error) {
        console.error("Error fetching vehicle details:", error);
        res.status(500).send("Server error");
    }
};

/* ***************************
 *  Render inventory management view
 * ************************** */
invCont.managementView = async (req, res) => {
    try {
        let nav = await utilities.getNav(); // Obtenha a navegação aqui
        const messages = req.flash('info'); // Lida com mensagens flash, se houver

        res.render("./inventory/management", {
            title: "Inventory Management",
            nav, // Passe a navegação para a view
            messages,
        });
    } catch (error) {
        console.error("Error rendering management view:", error);
        res.status(500).send("Server error");
    }
};


/* ***************************
 * Add Classification and Add Inventory View
 * ************************** */
invCont.addClassificationView = async (req, res) => {
    const messages = req.flash('info');
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        messages: messages
    });
};

// Add Inventory View
invCont.addInventoryView = async (req, res) => {
    try {
        const classificationList = await utilities.buildClassificationList(); // Get classification options
        const messages = req.flash('info');
        
        res.render("./inventory/add-inventory", {
            title: "Add Inventory Item",
            classificationList,
            messages,
        });
    } catch (error) {
        console.error("Error rendering add inventory view:", error);
        res.status(500).send("Server error");
    }
};

/* ***************************
 * Process Adding a New Classification
 * ************************** */
invCont.processAddClassification = async (req, res) => {
    try {
        const { classification_name } = req.body; // Get the classification name from the request body

        // Validate input
        if (!classification_name || /\s|[^a-zA-Z0-9]/.test(classification_name)) {
            req.flash('info', 'Invalid classification name.'); // Flash message for invalid input
            return res.redirect('/inv/add-classification'); // Redirect back to the add classification page
        }
        
        // Add classification to the database
        await invModel.addClassification(classification_name); // Ensure this method exists in your model
        req.flash('info', 'Classification added successfully.'); // Flash message for success
        res.redirect('/inv/'); // Redirect to the inventory management page after success
    } catch (error) {
        console.error("Error adding classification:", error);
        req.flash('info', 'Failed to add classification. Please try again.'); // Flash message for failure
        res.redirect('/inv/add-classification'); // Redirect back to the add classification page
    }
};

/* ***************************
 * Process Adding a New Inventory Item
 * ************************** */
invCont.processAddInventory = async (req, res) => {
    try {
        // Destructure the fields from the request body
        const { inv_make, inv_model, inv_year, classification_id, inv_image, inv_thumbnail } = req.body;

        // Server-side validation
        const errors = [];
        if (!inv_make || !inv_model || !inv_year || !classification_id) {
            errors.push("All fields are required.");
        }

        if (inv_year < 1900 || inv_year > new Date().getFullYear()) {
            errors.push("Year must be between 1900 and the current year.");
        }

        if (errors.length > 0) {
            req.flash('error', errors); // Store error messages in flash
            return res.redirect('/inv/add-inventory'); // Redirect back to the add inventory page
        }

        // Call the model to add the inventory item
        await invModel.addInventory({
            inv_make,
            inv_model,
            inv_year,
            classification_id,
            inv_image,
            inv_thumbnail,
        });

        req.flash('info', 'Inventory item added successfully.'); // Success message
        res.redirect('/inv/'); // Redirect to the inventory management view
    } catch (error) {
        console.error("Error adding inventory item:", error);
        req.flash('error', ['Failed to add inventory item. Please try again.']); // Flash message for failure
        res.redirect('/inv/add-inventory'); // Redirect back to the add inventory page
    }
};

// Export the inventory controller
module.exports = invCont;
