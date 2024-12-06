const { sql, poolPromise } = require('../utils/db');

async function getFaculty() {
    try {
        let pool = await poolPromise;

        // Query the TeacherDetails view directly
        let result = await pool.request().query(`
            SELECT 
                teacher_fullname,
                teacher_qualification,
                teacher_type,
                teacher_image,
                course_name,
                semester_number,
                subject_name
            FROM TeacherDetails;
        `);

        console.log('Database Query Result:', result.recordset);

        const facultyData = result.recordset.map(row => ({
            ...row,
            teacher_image: row.teacher_image
                ? `data:image/jpeg;base64,${Buffer.from(row.teacher_image).toString('base64')}`
                : null,
        }));

        return facultyData;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}

module.exports = {
    getFaculty
};
