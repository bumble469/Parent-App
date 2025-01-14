const NodeCache = require('node-cache');
const { sql, poolPromise } = require('../utils/db');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

async function decryptData(encryptedData) {
    try {
        const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);
        const cacheKey = `${final_data}_${encrypted_aes_key}`; 

        const cachedDecryptedData = cache.get(cacheKey);
        if (cachedDecryptedData) {
            return cachedDecryptedData;
        }

        const decryptedData = await callFlaskDecryptAPI(final_data, encrypted_aes_key);

        cache.set(cacheKey, decryptedData);

        return decryptedData;
    } catch (error) {
        console.error("Decryption failed: ", error.message);
        return null; 
    }
}

async function getStudentCurrentSemester(studentId) {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
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
            console.log('No student profile found');
            return null;
        }

        const student = result.recordset[0];

        const [decryptedFullName, decryptedRollNo] = await Promise.all([
            decryptData(student.student_full_name),
            decryptData(student.roll_number),
        ]);

        const formattedProfile = {
            current_Sem: student.semester_id,
            stud_fullname: decryptedFullName || "could not decrypt",
            stud_rollno: decryptedRollNo || "could not decrypt",
        };

        return { formattedProfile };
    } catch (error) {
        console.error('Error fetching student profile:', error.message);
        console.error('Error details:', error);
        throw error;
    }
}

module.exports = {
    getStudentCurrentSemester,
};
