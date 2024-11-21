const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');
const router = express.Router();

// Routes
router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;
