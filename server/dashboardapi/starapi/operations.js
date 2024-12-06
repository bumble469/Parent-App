const { sql, poolPromise } = require('../../utils/db');

async function getStudentMarksAndAttendanceForCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId) 
            .query(`
                SELECT subject_id, marks_obtained, exam_type_id, max_marks, total_lectures_attended, total_lectures_conducted
                FROM vw_student_dashboard
                WHERE student_id = @studentId;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No marks data found for the student in the current semester');
            return null; 
        }

        // Returning only the required marks data
        const studentMarks = result.recordset;

        return studentMarks;
    } catch (error) {
        console.error('Error fetching student marks: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentMarksAndAttendanceForCurrentSemester
};
