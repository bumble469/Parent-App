const { sql, poolPromise } = require('../utils/db');

async function getStudentCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    sem_id,
                    firstname,
                    lastname,
                    rollno
                FROM students 
                WHERE stud_id = 1
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No student-parent profile found');
            return null;
        }

        const profileData = result.recordset[0];

        const formattedProfile = {
            current_Sem: profileData.sem_id,
            stud_firstname: profileData.firstname,
            stud_lastname: profileData.lastname,
            stud_rollno: profileData.rollno, 
        };

        return formattedProfile;
    } catch (error) {
        console.error('Error fetching student-parent profile: ', error.message); // Log the error message for clarity
        console.error('Error details: ', error); // Log the full error object for more insights
        throw error;
    }
}

module.exports = {
    getStudentCurrentSemester
};
