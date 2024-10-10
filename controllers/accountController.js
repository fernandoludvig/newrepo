/* ****************************************
 *  Import required modules
 * *************************************** */
const utilities = require('../utilities/');

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
    // Example: Replace with actual authentication logic
    const user = await authenticateUser(email, password); // This function should check credentials

    if (user) {
      // If authentication is successful, redirect to My Account page
      res.redirect('/account');
    } else {
      // If authentication fails, re-render login page with a flash message
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
      messages: [], // Ensure messages is initialized as an empty array
    });
  } catch (error) {
    next(error);
  }
}


// Export the functions
module.exports = { buildLogin, processLogin, buildRegister };
