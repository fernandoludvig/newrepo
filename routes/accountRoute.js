// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to the account update view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Add the logout route
router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});

// Route to process account update
router.post(
    "/update",
    utilities.checkLogin,
    accountValidate.updateAccountRules(),
    accountValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
)

// Route to process account password change
router.post(
    "/update-password",
    utilities.checkLogin,
    accountValidate.changePasswordRules(),
    accountValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.changePassword)
)

// Route to process registration
router.post(
    "/register",
    accountValidate.registationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;