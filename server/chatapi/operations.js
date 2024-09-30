const { sql, poolPromise } = require('../utils/db'); 

async function getChatList(semesterNumber) {
    try {
        let pool = await poolPromise;
        const semesterName = `Semester ${semesterNumber}`;

        const query = `
            SELECT t.teacher_id, t.firstname, t.lastname, t.subject_name, t.teacher_image
            FROM TeacherDetails t
            WHERE t.semester_name = @semester
        `;
        
        let result = await pool.request()
            .input('semester', sql.NVarChar, semesterName) 
            .query(query);
        
        console.log('Database Query Result:', result.recordset);

        // Convert teacher_image to Base64 format
        const chatList = result.recordset.map(row => ({
            ...row,
            teacher_image: row.teacher_image
                ? `data:image/jpeg;base64,${Buffer.from(row.teacher_image).toString('base64')}`
                : null,
        }));

        return chatList; 
    } catch (error) {
        console.error('Error fetching chat list:', error); 
        throw error; 
    }
}

module.exports = {
    getChatList
};
