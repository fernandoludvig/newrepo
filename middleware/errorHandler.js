// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack for debugging

    // Render the error view with a title and message
    res.status(500).render('error', {
        title: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : "An unexpected error occurred. Please try again later."
    });
}

module.exports = errorHandler;
