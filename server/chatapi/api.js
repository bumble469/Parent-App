require('../../src/Global')
const express = require('express');
const router = express.Router();
const { getChatList } = require('./operations'); // Import the function from operations.js
router.get('/chat-list', async (req, res) => {
    try {
        const studentId = global.student_id; // Assuming the stud_id is stored in the session after login
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is missing in the session.' });
        }
        const studentDetails = await getChatList(studentId);

        if (!studentDetails) {
            return res.status(404).json({ message: 'No data found for the student in the current semester' });
        }

        res.json(studentDetails);
    } catch (error) {
        console.error('Error in chat route: ', error.message);
        res.status(500).json({ error: 'Error fetching teacher chat' });
    }
});
module.exports = router;
