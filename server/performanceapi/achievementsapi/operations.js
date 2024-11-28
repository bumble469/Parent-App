const { sql, poolPromise } = require('../../utils/db');

async function getStudentAchievementsForPerformance(studentId, semester) {
    try {
        let pool = await poolPromise;

        // Modify the query to filter by both studentId and semester
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)  
            .input('semester', sql.Int, semester)  // Add semester as input
            .query(`
                SELECT *
                FROM student_achievements
                WHERE stud_id = @studentId AND sem_id = @semester
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
    getStudentAchievementsForPerformance
};
