const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const Comment = require("../models/comment"); // Importa o modelo de comentário

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    // If no vehicles exist for this classification, display a message
    if (data.length === 0) {
        res.render("./inventory/classification", {
            title: "No vehicles",
            nav,
            grid,
            message: 'No vehicles exist for this classification.',
        });
    } else {
        const className = data[0].classification_name;
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        });
    }
};

/* ***************************
 *  Build a specific vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleDetails(inv_id);
    const detail = await utilities.buildVehicleDetail(data);
    let nav = await utilities.getNav();

    // Busca os comentários relacionados ao veículo
    const comments = await Comment.fetchByItemId(inv_id);
    
    // Obtém o user_id da sessão
    const userId = req.session.userId;

    res.render("./inventory/detail", {
        title: data.inv_make + " " + data.inv_model,
        nav,
        detail,
        comments, // Passa os comentários para a view
        user_id: userId, // Passa o user_id para a view
    });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.getClassificationSelect();
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
        errors: null,
    });
};

/* ***************************
 *  Build inventory add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
};

/* ***************************
 *  Build inventory add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.getClassificationSelect();
    res.render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        classificationSelect,
        errors: null,
    });
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result) {
        req.flash("notice", "Classification added successfully.");
        res.redirect("/inv");
    } else {
        req.flash("notice", "Sorry, there was an error adding the classification.");
        res.render("/inv/add-classification", {
            title: "Add Classification",
            nav,
        });
    }
};

/* ***************************
 *  Process add vehicle
 * ************************** */
invCont.processAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.getClassificationSelect();
    let { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    // if vehicle_image is empty, set to fallback image
    if (inv_image == "") {
        inv_image = "/images/vehicles/no-image.png";
    }
    // if vehicle_thumbnail is empty, set to fallback image
    if (inv_thumbnail == "") {
        inv_thumbnail = "/images/vehicles/no-image-tn.png";
    }

    const result = await invModel.addVehicle(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (result) {
        req.flash("notice", "Vehicle added successfully.");
        res.redirect("/inv");
    } else {
        req.flash("notice", "Sorry, there was an error adding the vehicle.");
        res.render("/inv/add-vehicle", {
            title: "Add Vehicle",
            nav,
            classificationSelect,
            errors: null,
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error("No data returned"));
    }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditVehicle = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleDetails(inv_id);
    const classificationSelect = await utilities.getClassificationSelect(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id,
    });
};

/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.buildDeleteVehicle = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleDetails(inv_id);
    const classificationSelect = await utilities.getClassificationSelect(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName + "?",
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model;
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        });
    }
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const inv_id = parseInt(req.body.inv_id);
    const itemData = await invModel.getVehicleDetails(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
        req.flash("notice", `The ${itemName} was successfully deleted.`);
        res.redirect("/inv/");
    } else {
        req.flash("notice", "Sorry, the deletion failed.");
        res.status(501).render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        });
    }
};

module.exports = invCont;
