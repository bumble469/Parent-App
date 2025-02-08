const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { getStudentDetailsForPerformance } = require('./operations');
router.use(cookieParser());
router.get('/student', async (req, res) => {
    try {
        const studentId = req.cookies.student_id ? parseInt(req.cookies.student_id, 10) : 1001;
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is missing in the session.' });
        }

        // Call the function to get student details for the current semester
        const studentDetails = await getStudentDetailsForPerformance(studentId);

        if (!studentDetails) {
            return res.status(404).json({ message: 'No data found for the student in the current semester' });
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
