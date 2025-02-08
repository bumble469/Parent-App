const operations = require('./events_operations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

// Middleware for logging
router.use((req, res, next) => {
    console.log('Middleware activated for faculty API');
    next();
});

// Define the endpoint to get faculty details
router.route('/events').get(async (req, res) => {
    try {
        const studentId = req.cookies.student_id ? parseInt(req.cookies.student_id, 10) : 1001;
        const result = await operations.getEvents(studentId);
        console.log('Fetched data:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; // Export the router
