require('../../src/Global');
const express = require('express');
const router = express.Router();
const { getStudentCurrentSemester } = require('./operations');

router.get('/currentsemester', async (req, res) => {
    try {
        const studentId = global.student_id;
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is missing in the session.' });
        }

        // Fetch the student details
        const studentDetails = await getStudentCurrentSemester(studentId);

        if (!studentDetails) {
            return res.status(404).json({ message: 'No data found for the student in the current semester' });
        }

        // Send the response
        res.json(studentDetails);
    } catch (error) {
        console.error('Error in student-performance route: ', error.message);
        res.status(500).json({ error: 'Error fetching student performance' });
    }
});

module.exports = router;
