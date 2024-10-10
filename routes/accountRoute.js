const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Ensure the path is correct
const accountController = require('../controllers/accountController'); // Ensure this path is correct

// GET route for the "My Account" page
router.get('/', utilities.handleErrors(accountController.buildLogin)); // Using the buildLogin function

// GET route for the login page
router.get('/login', utilities.handleErrors(accountController.buildLogin)); // Ensures the login view is rendered

// POST route to handle login form submission
router.post('/login', utilities.handleErrors(accountController.processLogin)); // Using processLogin function

// GET route for the registration page
router.get('/register', utilities.handleErrors(accountController.buildRegister)); // Ensure buildRegister is defined in the controller

// POST route to handle registration form submission
router.post('/register', utilities.handleErrors(accountController.processRegister)); // Ensure processRegister is defined in the controller

// Export the router
module.exports = router;
