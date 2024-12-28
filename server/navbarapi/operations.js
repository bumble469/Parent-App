const { sql, poolPromise } = require('../utils/db');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');

async function decryptData(encryptedData) {
    try{
        const {final_data, encrypted_aes_key} = JSON.parse(encryptedData);
        const decryptedData = await callFlaskDecryptAPI(final_data,encrypted_aes_key);
        return decryptedData;
    }catch(error){
        console.error("Decryption failed: ", error);
        return null;
    }
}
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
        const decryptedFullName = await decryptData(result.recordset[0].student_full_name);
        const decryptedRollNo = await decryptData(result.recordset[0].roll_number);
        const formattedProfile = {
            current_Sem: result.recordset[0].semester_id,
            stud_fullname: decryptedFullName || "unable to decrypt",
            stud_rollno: decryptedRollNo || "unable to decrypt"
        };

        const response = {formattedProfile};
        return response;
    } catch (error) {
        console.error('Error fetching student-parent profile: ', error.message); // Log the error message for clarity
        console.error('Error details: ', error); // Log the full error object for more insights
        throw error;
    }
}

module.exports = {
    getStudentCurrentSemester
};
