const express = require('express');
const router = express.Router();
const utilities = require('../utilities/index'); // Certifique-se de que o caminho esteja correto
const accountController = require('../controllers/accountController'); // Certifique-se de que o caminho esteja correto
const regValidate = require('../utilities/account-validation'); // Importação do módulo de validação

// GET route for the "My Account" page
router.get('/', utilities.handleErrors(accountController.buildLogin));

// GET route for the login page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// POST route to handle login form submission
router.post(
  '/login',
  regValidate.loginRules(), // Aplicar regras de validação
  regValidate.checkLoginData, // Checar dados para erros
  utilities.handleErrors(accountController.processLogin) // Processar login
);

// GET route for the registration page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// POST route to handle registration form submission
router.post(
  "/register",
  regValidate.registrationRules(), // Aplicar regras de validação
  regValidate.checkRegData,        // Checar dados para erros
  utilities.handleErrors(accountController.registerAccount) // Handle registration
);

// Export the router
module.exports = router;

