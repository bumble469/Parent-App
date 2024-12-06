const { sql, poolPromise } = require('../utils/db');

async function getStudentCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    semester_id,
                    student_full_name,
                    roll_number
                FROM student_data 
                WHERE student_id = @studentId;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No student-parent profile found');
            return null;
        }

        const profileData = result.recordset[0];

        const formattedProfile = {
            current_Sem: profileData.semester_id,
            stud_fullname: profileData.student_full_name,
            stud_rollno: profileData.roll_number, 
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
