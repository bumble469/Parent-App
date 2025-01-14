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
                SELECT 
                    subject_id,
                    subject_name,
                    SUM(marks_obtained) AS totalMarks,
                    SUM(max_marks) AS totalPossibleMarks,
                    SUM(total_lectures_attended) AS total_lectures_attended,
                    SUM(total_lectures_conducted) AS total_lectures_conducted
                FROM 
                    vw_student_dashboard
                WHERE 
                    student_id = @studentId
                GROUP BY 
                    subject_id, subject_name
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No data found for the student in the current semester');
            return null;
        }

        const transformedData = result.recordset.map(row => ({
            sub_id: row.subject_id,
            sub_name: row.subject_name,
            totalMarks: row.totalMarks,
            totalPossibleMarks: row.totalPossibleMarks,
            lectures_attended: row.total_lectures_attended,
            lectures_total: row.total_lectures_conducted
        }));

        studentCache.set(studentId, transformedData);

        return transformedData;

    } catch (error) {
        console.error('Error fetching student marks and attendance: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentMarksAndAttendanceForCurrentSemester
};
