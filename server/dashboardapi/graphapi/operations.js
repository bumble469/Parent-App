const { sql, poolPromise } = require('../../utils/db');

async function getStudentMarksAndAttendanceForCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    sp.sub_id,
                    sp.name AS sub_name,
                    SUM(sp.marks_obtained) AS total_marks_obtained,
                    SUM(sp.marks_total) AS total_marks_possible,
                    sp.lectures_attended,  -- Keep the original lectures attended
                    sp.lectures_total      -- Keep the original lectures total
                FROM 
                    StudentPerformance sp
                WHERE 
                    sp.stud_id = @studentId
                    AND sp.sem_id = (
                        SELECT MAX(sem_id)
                        FROM StudentPerformance 
                        WHERE stud_id = @studentId
                    )
                GROUP BY 
                    sp.sub_id, sp.name, sp.lectures_attended, sp.lectures_total -- Include lectures in the GROUP BY
                ORDER BY 
                    sp.sub_id;

            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No data found for the student in the current semester');
            return null;
        }

        // Return transformed subject-wise data with subject names
        const transformedData = result.recordset.map(row => ({
            sub_id: row.sub_id,
            sub_name: row.sub_name,
            totalMarks: row.total_marks_obtained,
            totalPossibleMarks: row.total_marks_possible,
            lectures_attended: row.lectures_attended,
            lectures_total: row.lectures_total
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
