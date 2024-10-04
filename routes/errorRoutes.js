// routes/errorRoutes.js
const express = require('express');
const { intentionalError } = require('../controllers/errorController'); // Ensure this path is correct

const router = express.Router();

// Route to trigger the intentional error
router.get('/trigger-error', intentionalError);

module.exports = router;
