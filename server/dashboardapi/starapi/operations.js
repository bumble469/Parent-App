const { sql, poolPromise } = require('../../utils/db');
const NodeCache = require('node-cache');

const studentCache = new NodeCache({ stdTTL: 120 });

async function getStudentMarksAndAttendanceForCurrentSemester(studentId) {
    try {
        const cachedData = studentCache.get(studentId);
        if (cachedData) {
            console.log('Returning cached marks and attendance data');
            return cachedData;
        }

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

        const studentMarks = result.recordset;

        studentCache.set(studentId, studentMarks);

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
