const { sql, poolPromise } = require('../../utils/db');

async function getStudentDetailedMarksForPerformance(studentId, semester) {
    try {
        let pool = await poolPromise;

        // Modify the query to select the data from StudentPerformance based on studentId and semester
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)  
            .input('semester', sql.Int, semester)  // Add semester as input
            .query(`
               SELECT 
                    sp.student_id,
                    sp.subject_id,
                    sp.semester_id,
                    sp.subject_name,
                    sp.exam_type,
                    sp.marks_obtained,
                    sp.max_marks
               FROM vw_student_performance sp
               WHERE sp.student_id = @studentId
               AND sp.semester_id = @semester
               ORDER BY sp.subject_id;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log(`No data found for student ${studentId} in semester ${semester}`);
            return null;  // No data found for the student in the current semester
        }

        const studentPerformanceData = result.recordset;

        return studentPerformanceData; // Return the performance data
    } catch (error) {
        console.error('Error fetching student performance details: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentDetailedMarksForPerformance
};
