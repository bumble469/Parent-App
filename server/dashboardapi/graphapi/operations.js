const { sql, poolPromise } = require('../../utils/db');

async function getStudentMarksAndAttendanceForCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    subject_id,
                    subject_name,
                    SUM(marks_obtained) AS totalMarks,    -- Sum of marks_obtained
                    SUM(max_marks) AS totalPossibleMarks,  -- Sum of max_marks
                    SUM(total_lectures_attended) AS total_lectures_attended,  -- Total lectures attended
                    SUM(total_lectures_conducted) AS total_lectures_conducted -- Total lectures conducted
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

        // Return transformed subject-wise data with subject names
        const transformedData = result.recordset.map(row => ({
            sub_id: row.subject_id,
            sub_name: row.subject_name,
            totalMarks: row.totalMarks,
            totalPossibleMarks: row.totalPossibleMarks,
            lectures_attended: row.total_lectures_attended,
            lectures_total: row.total_lectures_conducted
        }));

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
