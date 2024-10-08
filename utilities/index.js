const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML
 ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid = ''; // Initialize an empty string to hold the HTML

  if (data.length > 0) { // Check if data array is not empty
    grid = '<ul id="inv-display">'; // Start unordered list for inventory display

    data.forEach(vehicle => { // Iterate through each vehicle in the data array
      grid += '<li>'; // Start list item for vehicle
      grid += '<a href="../../inv/vehicle/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">';
      grid += '<img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" /></a>'; // Vehicle thumbnail

      grid += '<div class="namePrice">'; // Start div for name and price
      grid += '<hr />'; // Horizontal line
      grid += '<h2>'; // Start vehicle name heading
      grid += '<a href="../../inv/vehicle/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'; // Vehicle name link
      grid += '</h2>'; // End vehicle name heading
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'; // Formatted vehicle price
      grid += '</div>'; // End name and price div
      grid += '</li>'; // End list item for vehicle
    });

    grid += '</ul>'; // End unordered list
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'; // Message for no vehicles found
  }

  return grid; // Return the constructed HTML string
}

exports.wrapVehicleDataInHTML = (vehicle) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${vehicle.make} ${vehicle.model}</title>
      <link rel="stylesheet" href="/styles/main.css"> <!-- Link to your CSS -->
  </head>
  <body>
      <div class="vehicle-detail-container">
          <img src="${vehicle.fullSizeImageURL}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
          <div class="vehicle-details">
              <h1>${vehicle.make} ${vehicle.model}</h1>
              <h2>${vehicle.year}</h2>
              <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
              <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
              <p><strong>Description:</strong> ${vehicle.description}</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util; // Export utility functions