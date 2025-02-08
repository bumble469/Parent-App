const express = require('express');
const router = express.Router();
const { insertFeedbackForStudent } = require('./operations');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post('/feedback-insert', async (req, res) => {
    try {
      const { feedbackType, feedbackRating, feedbackBody, dateTime } = req.body;
      const studentId = req.cookies.student_id ? parseInt(req.cookies.student_id, 10) : 1001;
  
      if (!studentId) {
        return res.status(400).json({ message: 'Student ID is missing in the session.' });
      }
  
      const result = await insertFeedbackForStudent(studentId, { feedbackType, feedbackRating, feedbackBody, dateTime });
  
      if (!result) {
        return res.status(400).json({ message: 'Failed to insert feedback' });
      }
  
      res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Error in feedback route: ', error.message);
      res.status(500).json({ error: 'Error processing feedback' });
    }
  });
  

module.exports = router;
