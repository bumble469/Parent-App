const NodeCache = require('node-cache');
const { sql, poolPromise } = require('../../utils/db');
const { Buffer } = require('buffer');


const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Retrieve chat messages with caching
async function getChatMessages(chatId) {
    try {
        const cacheKey = `chat_${chatId}`;
        let messages = cache.get(cacheKey);

        if (!messages) {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('chatId', sql.Int, chatId)
                .query('SELECT * FROM chat_messages WHERE chat_id = @chatId ORDER BY sent_on DESC');

            messages = result.recordset;
            cache.set(cacheKey, messages);  // Store in cache
        }

        return messages;
    } catch (error) {
        console.error('Error fetching chat messages:', error.stack);
        throw new Error('Database error: Unable to fetch chat messages.');
    }
}

// Send a message safely with chat existence validation
async function sendMessage(chatId, senderType, senderId, message) {
    try {
        const pool = await poolPromise;

        // Check if chat exists before inserting
        const chatCheck = await pool.request()
            .input('chatId', sql.Int, chatId)
            .query('SELECT 1 FROM chat_messages WHERE chat_id = @chatId');

        if (chatCheck.recordset.length === 0) {
            throw new Error('Invalid chat ID: Chat does not exist.');
        }

        await pool.request()
            .input('chatId', sql.Int, chatId)
            .input('sendingUserType', sql.VarChar, senderType)
            .input('sendingUserId', sql.Int, senderId)
            .input('messageDetails', sql.NVarChar, message)
            .input('sentOn', sql.DateTime, new Date())
            .query(`
                INSERT INTO chat_messages 
                (chat_id, sending_user_type, sending_user_id, message_details, sent_on) 
                VALUES (@chatId, @sendingUserType, @sendingUserId, @messageDetails, @sentOn)
            `);
    } catch (error) {
        console.error('Error sending message:', error.stack);
        throw new Error('Database error: Unable to send message.');
    }
}

module.exports = { getChatMessages, sendMessage };
