/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
*******************************************/

/* ***********************
* Require Statements
*************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const errorController = require("./controllers/errorController");
const accountController = require("./controllers/accountController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities"); // Ensure this line is present
const session = require("express-session");
const pool = require('./database/');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const checkAccountType = require('./utilities/checkAccountType');

/* ***********************
* Middleware
************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Middleware para definir `user` em `res.locals`
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Define user a partir da sessão
  next(); // Chama o próximo middleware
});

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Apply the JWT middleware to all routes
app.use(utilities.checkJWTToken); // Add this line

/* ***********************
* View Engine and Templates
*************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
* Routes
*************************/
app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));

// Rotas que requerem verificação de tipo de conta
app.use("/inv/add", checkAccountType); // Adicionar veículo
app.use("/inv/edit", checkAccountType); // Editar veículo
app.use("/inv/delete", checkAccountType); // Deletar veículo
app.use("/inv/manage", checkAccountType); // Gerenciar inventário

app.use("/inv", utilities.handleErrors(inventoryRoute));
app.use("/inv/detail", utilities.handleErrors(inventoryRoute));
app.use("/account", utilities.handleErrors(accountRoute));
app.use("/error", utilities.handleErrors(errorController));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message = err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
* Local Server Information
*************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
* Log statement to confirm server operation
*************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
