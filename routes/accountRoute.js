const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure the path is correct
const accountController = require('../controllers/accountController'); // Ensure the path is correct
const regValidate = require('../utilities/account-validation'); // Import validation module

// GET route for the "My Account" page
router.get('/', 
    utilities.checkLogin, // Add checkLogin middleware here
    utilities.handleErrors(accountController.buildAccountManagement) // Use the correct controller function for account management
);

// GET route for the login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// POST route to handle login form submission
router.post(
  '/login',
  regValidate.loginRules(), // Apply validation rules
  regValidate.checkLoginData, // Check data for errors
  utilities.handleErrors(accountController.processLogin) // Process login
);

// GET route for the registration page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// POST route to handle registration form submission
router.post(
  "/register",
  regValidate.registrationRules(), // Apply validation rules
  regValidate.checkRegData,        // Check data for errors
  utilities.handleErrors(accountController.registerAccount) // Handle registration
);

// Export the router
module.exports = router;
