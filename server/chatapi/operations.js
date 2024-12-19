const { sql, poolPromise } = require('../utils/db');

async function getChatList(studentId) {
    try {
        let pool = await poolPromise;

        const query = `
            SELECT 
                t.teacher_id,
                t.teacher_fullname,
                STRING_AGG(t.subject_name, ', ') AS subject_name, -- Concatenate all subjects
                t.teacher_image,
                t.teacher_type,
                STRING_AGG(t.semester_number, ', ') AS semester_number  -- Corrected the syntax here
            FROM 
                TeacherDetails t
            INNER JOIN 
                student_data s
            ON 
                t.semester_id = s.semester_id
                AND t.course_id = s.course_id
            WHERE 
                s.student_id = @studentId
            GROUP BY 
                t.teacher_id, 
                t.teacher_fullname, 
                t.teacher_image,
                t.teacher_type
        `;

        // Fetch data based on the provided studentId
        let result = await pool.request()
            .input('studentId', sql.NVarChar, studentId)
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
    getChatList,
};
