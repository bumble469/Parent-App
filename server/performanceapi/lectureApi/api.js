require('../../../src/Global');
const express = require('express');
const router = express.Router();
const { getLectureViewsForStudent } = require('./operations'); // Import the function from operations.js

router.get('/student/lectureviews', async (req, res) => {
    try {
        const studentId = global.student_id; 
        const { semester } = req.query; 

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is missing in the session.' });
        }

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        const lectureViews = await getLectureViewsForStudent(studentId, semester);

        if (!lectureViews) {
            return res.status(404).json({ message: `No lecture views found for the student in semester ${semester}` });
        }

        res.json(lectureViews);
    } catch (error) {
        // Catch and handle any errors that occur during the API request
        console.error('Error in student-lectureviews route: ', error.message);
        res.status(500).json({ error: 'Error fetching student lecture views' });
    }
});

module.exports = router;
