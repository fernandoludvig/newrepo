/* ****************************************
 *  Import required modules
 * *************************************** */
const utilities = require('../utilities/');
const accountModel = require('../models/account-model'); // Ensure the path is correct

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      messages: [], // Ensure messages is initialized as an empty array
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process login data
 * *************************************** */
async function processLogin(req, res, next) {
  const { email, password } = req.body;

  try {
      const user = await authenticateUser(email, password); // This function should check credentials

      if (user) {
          res.redirect('/account');
      } else {
          let nav = await utilities.getNav();
          res.render("account/login", {
              title: "Login",
              nav,
              messages: ["Invalid email or password. Please try again."] // Pass messages as an array
          });
      }
  } catch (error) {
      next(error);
  }
}


/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // Ensure that errors is initialized correctly
      messages: []   // Ensure messages is initialized as an empty array
    });
  } catch (error) {
    next(error);
  }
}




/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
  );

  if (regResult) {
      req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`);
      res.status(201).render("account/login", {
          title: "Login",
          nav,
          messages: [] // Ensure messages is initialized as an empty array
      });
  } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
          title: "Registration",
          nav,
          messages: [] // Ensure messages is initialized as an empty array
      });
  }
}


// Export the functions
module.exports = { buildLogin, processLogin, buildRegister, registerAccount };
