const express = require('express');
const router = express.Router();
const { getChatList } = require('./operations');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/chat-list', async (req, res) => {
    try {
        const studentId = req.cookies.student_id ? parseInt(req.cookies.student_id, 10) : 1001;
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
