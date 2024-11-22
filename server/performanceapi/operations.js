const { sql, poolPromise } = require('../utils/db');

async function getStudentDetailsForPerformance(studentId) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)  
            .query(`
                SELECT *
                FROM StudentPerformance
                WHERE stud_id = @studentId
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No data found for the student in the current semester');
            return null;  // No data found for the current semester
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
    getStudentDetailsForPerformance
};
