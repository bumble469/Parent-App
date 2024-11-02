const { sql, poolPromise } = require('../utils/db');

async function getStudentParentProfile(studentId) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    full_name, 
                    rollno, 
                    age, 
                    student_email, 
                    dob, 
                    enrollment_date, 
                    gpa, 
                    student_address,
                    student_contact, 
                    mothername, 
                    mothercontact, 
                    motheremail, 
                    motheraddress, 
                    motheroccupation, 
                    motherworkhours,
                    fathername, 
                    fathercontact, 
                    fatheremail, 
                    fatheraddress, 
                    fatheroccupation, 
                    fatherworkhours 
                FROM student_parent_info 
                WHERE stud_id = 3
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No student-parent profile found');
            return null;
        }

        const profileData = result.recordset[0];

        const formattedProfile = {
            studentInfo: {
                fullName: profileData.full_name,
                rollNo: profileData.rollno,
                age: profileData.age,
                email: profileData.student_email,
                dob: profileData.dob,
                enrollmentDate: profileData.enrollment_date,
                gpa: profileData.gpa,
                address: profileData.student_address,
                contactMobile: profileData.student_contact,
            },
            motherInfo: {
                name: profileData.mothername,
                contactMobile: profileData.mothercontact,
                email: profileData.motheremail,
                address: profileData.motheraddress,
                occupation: profileData.motheroccupation,
                workHours: profileData.motherworkhours,
            },
            fatherInfo: {
                name: profileData.fathername,
                contactMobile: profileData.fathercontact,
                email: profileData.fatheremail,
                address: profileData.fatheraddress,
                occupation: profileData.fatheroccupation,
                workHours: profileData.fatherworkhours,
            }
        };

        return formattedProfile;
    } catch (error) {
        console.error('Error fetching student-parent profile: ', error.message); // Log the error message for clarity
        console.error('Error details: ', error); // Log the full error object for more insights
        throw error;
    }
}

module.exports = {
    getStudentParentProfile
};
