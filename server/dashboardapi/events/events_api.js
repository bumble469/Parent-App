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

// Define the endpoint to get timetable (no student_id needed)
router.route('/events').get(async (req, res) => {
    try {
        // Simply fetch timetable without using student_id
        const result = await operations.getTimetable(); // No student_id passed
        console.log('Fetched data:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
