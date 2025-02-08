const { sql, poolPromise } = require('../utils/db');

async function insertFeedbackForStudent(studentId, feedbackData) { // Accept feedback data from frontend
    try {
        let pool = await poolPromise;

        // Fetch parent ID based on student ID
        const parentQuery = `
            SELECT parent_id 
            FROM student_parent
            WHERE student_id = @studentId
        `;

        const parentResult = await pool.request()
        .input('studentId', sql.Int, studentId) // Correct type here
        .query(parentQuery);


        if (parentResult.recordset.length === 0) {
            console.log('No parent found for studentId:', studentId);
            return null;
        }

        const parentId = parentResult.recordset[0].parent_id;

        // Insert feedback data into the feedback table
        const insertQuery = `
            INSERT INTO parent_feedback (
                parent_id, 
                date_time, 
                feedback_type, 
                feedback_rating, 
                feedback_body
            )
            VALUES (@parentId, @dateTime, @feedbackType, @feedbackRating, @feedbackBody)
        `;

        const result = await pool.request()
            .input('parentId', sql.Int, parentId)
            .input('dateTime', sql.DateTime, feedbackData.dateTime) // assuming feedbackData contains a dateTime
            .input('feedbackType', sql.NVarChar, feedbackData.feedbackType) 
            .input('feedbackRating', sql.Int, feedbackData.feedbackRating) 
            .input('feedbackBody', sql.NVarChar, feedbackData.feedbackBody) 
            .query(insertQuery);

        return result;
    } catch (error) {
        console.error('Error inserting feedback:', error.message);
        throw error;
    }
}

module.exports = {
    insertFeedbackForStudent,
};
