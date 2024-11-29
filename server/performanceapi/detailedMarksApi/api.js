require('../../../src/Global');
const express = require('express');
const router = express.Router();
const { getStudentDetailedMarksForPerformance } = require('./operations'); // Import the function from operations.js

// Updated route to include semester in the query
router.get('/student/detailedmarks', async (req, res) => {
    try {
        const studentId = global.student_id; // Assuming you have a way to retrieve the student ID (e.g., from session, JWT, etc.)
        const { semester } = req.query; // Get the semester from the query string

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is missing in the session.' });
        }

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        // Call the function to get student achievements for the given semester
        const studentDetails = await getStudentDetailedMarksForPerformance(studentId, semester);

        if (!studentDetails) {
            return res.status(404).json({ message: `No data found for the student in semester ${semester}` });
        }

        // Send the student details as a response
        res.json(studentDetails);
    } catch (error) {
        // Catch and handle any errors that occur during the API request
        console.error('Error in student-performance route: ', error.message);
        res.status(500).json({ error: 'Error fetching student performance' });
    }
});

module.exports = router;
