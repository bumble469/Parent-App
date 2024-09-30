// chat/api.js

const operations = require('./operations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.use((req, res, next) => {
    console.log('Chat Middleware activated');
    next();
});

router.get('/chat-list/:semesterNumber', async (req, res) => {
    try {
        const semesterNumber = req.params.semesterNumber;
        console.log('Fetching chat list for semester:', semesterNumber);
        
        const result = await operations.getChatList(semesterNumber);
        console.log('Chat list fetched:', result); 
        res.json(result);  // This returns the array of teacher objects including teacher_image
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
