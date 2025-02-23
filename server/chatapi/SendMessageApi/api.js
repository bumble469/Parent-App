const express = require('express');
const router = express.Router();
const { getChatMessages } = require('./operation');


// Get chat messages
router.get('/:chatId', async (req, res) => {
    const chatId = req.params.chatId;
    try {
        // Validate that chatId is a number (you can adjust the validation as needed)
        if (isNaN(chatId)) {
            return res.status(400).json({ error: 'Invalid chatId format' });
        }

        const messages = await operation.getChatMessages(chatId);
        res.status(200).json(messages);  // Success: 200 status
    } catch (error) {
        console.error('Error fetching chat messages:', error.stack);
        res.status(500).json({ error: error.message });  // Server error: 500 status
    }
});

// Send a message
router.post('/send', async (req, res) => {
    const { chat_id, sender_type, sender_id, message } = req.body;

    // Validate the required fields
    if (!chat_id || !sender_type || !sender_id || !message) {
        return res.status(400).json({ error: 'Missing required fields' });  // Client error: 400 status
    }

    try {
        // Ensure chat_id is a number and sender_id is valid
        if (isNaN(chat_id) || isNaN(sender_id)) {
            return res.status(400).json({ error: 'Invalid input: chat_id and sender_id must be numbers' });
        }

        await operation.sendMessage(chat_id, sender_type, sender_id, message);
        res.status(200).json({ success: true, message: 'Message sent successfully' });  // Success: 200 status
    } catch (error) {
        console.error('Error sending message:', error.stack);
        res.status(500).json({ error: error.message });  // Server error: 500 status
    }
});

module.exports = router;