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
                    s.name,
                    da.attendance_date,
                    da.attended
                FROM DetailedAttendance da
                JOIN subjects s ON da.sub_id = s.sub_id
                WHERE da.stud_id = @studentId
                AND da.sem_id = @semester
                ORDER BY 
                    YEAR(da.attendance_date) ASC,
                    MONTH(da.attendance_date) ASC;
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
