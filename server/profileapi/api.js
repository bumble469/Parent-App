require('../../src/Global')
const operations = require('./operations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router(); // Use router instead of app

// Middleware setup for the router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

// Middleware for logging
router.use((req, res, next) => {
    console.log('Middleware activated for profile API');
    next();
});

// Define the endpoint to get faculty details
router.route('/profile').get(async (req, res) => {
    try {
        const result = await operations.getStudentParentProfile(global.student_id);
        console.log('Fetched data:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching profile info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
