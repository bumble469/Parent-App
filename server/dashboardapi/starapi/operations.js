const { sql, poolPromise } = require('../../utils/db');

async function getStudentMarksAndAttendanceForCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId) 
            .query(`
                SELECT sub_id, marks_obtained, marks_type, marks_total, lectures_attended, lectures_total
                FROM StudentPerformance
                WHERE stud_id = @studentId
                  AND sem_id = (
                    SELECT MAX(sem_id) 
                    FROM StudentPerformance 
                    WHERE stud_id = @studentId
                  )
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
