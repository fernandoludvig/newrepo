const express = require("express");
const router = new express.Router();
const accountCont = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

// Route to build login view
router.get("/login", utilities.handleErrors(accountCont.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountCont.buildRegister));

// Post new account information
router.post(
    '/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountCont.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountCont.accountLogin) // Use the correct controller function
);

// New route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountCont.accountManagement)); // Default route for accounts

module.exports = router;
