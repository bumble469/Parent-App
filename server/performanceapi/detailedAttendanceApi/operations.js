const { sql, poolPromise } = require('../../utils/db');

async function getStudentDetailedAttendanceForPerformance(studentId, semester) {
    try {
        let pool = await poolPromise;

        // Modify the query to filter by both studentId and semester
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)  
            .input('semester', sql.Int, semester)  // Add semester as input
            .query(`
               SELECT
                    ms.subject_name,
                    da.scan_time,
                    da.is_present
                FROM student_attendance da
                
                JOIN master_time_table mt ON da.time_table_id = mt.time_table_id
                
                JOIN master_subjects ms ON mt.subject_id = ms.subject_id
                WHERE da.student_id = @studentId
                AND ms.semester_id = @semester
                ORDER BY 
                    YEAR(da.scan_time) ASC,
                    MONTH(da.scan_time) ASC;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log(`No data found for student ${studentId} in semester ${semester}`);
            return null;  // No data found for the student in the current semester
        }

        const studentDetails = result.recordset;

        return studentDetails; // Return the student details
    } catch (error) {
        console.error('Error fetching student performance details: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentDetailedAttendanceForPerformance
};
