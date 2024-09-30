const { sql, poolPromise } = require('../utils/db');

async function getFaculty() {
    try {
        let pool = await poolPromise; 
        
        let result = await pool.request().query(`
            SELECT t.teacher_id, t.firstname, t.lastname, t.type, t.qualification, t.teacher_image, t.subject_name, t.semester_name
            FROM TeacherDetails t
            LEFT JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
            LEFT JOIN subjects s ON ts.subject_id = s.sub_id
            LEFT JOIN semesters sem ON ts.sem_id = sem.sem_id;
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
