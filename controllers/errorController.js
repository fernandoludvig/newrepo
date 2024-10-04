// controllers/errorController.js
exports.intentionalError = (req, res) => {
    // This will trigger the error handler
    throw new Error("This is a deliberate error to test error handling.");
};
