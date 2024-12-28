const { sql, poolPromise } = require('../utils/db');
const { Buffer } = require('buffer');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');

// Helper function to decrypt the data
async function decryptData(encryptedData) {
    try {
        const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);
        const decryptedData = await callFlaskDecryptAPI(final_data, encrypted_aes_key);
        return decryptedData;
    } catch (error) {
        console.error('Decryption failed: ', error);
        return null; 
    }
}

async function getStudentParentProfile(studentId) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    student_id,
                    studentFullName,
                    rollNo,
                    student_age AS age,
                    studentEmail,
                    student_dob AS dob,
                    enrollmentDate,
                    studentAddress,
                    studentContact,
                    student_image AS studentImage,
                    parentFullName,
                    parentEmail,
                    parentContact,
                    total_fees,
                    fees_paid,
                    fees_pending,
                    transaction_id,
                    transaction_date,
                    transaction_type,
                    payment_complete,
                    transaction_status
                FROM Student_Profile
                WHERE student_id = @studentId
                ORDER BY transaction_date
            `);

        if (result.recordset.length === 0) {
            console.log('No student-parent profile found');
            return null;
        }

        const studentImage = result.recordset[0].studentImage
            ? `data:image/jpeg;base64,${Buffer.from(result.recordset[0].studentImage).toString('base64')}`
            : null;

        // Decrypt sensitive data for student
        const decryptedFullName = await decryptData(result.recordset[0].studentFullName);
        const decryptedRollNo = await decryptData(result.recordset[0].rollNo);
        const decryptedEmail = await decryptData(result.recordset[0].studentEmail);
        const decryptedPhone = await decryptData(result.recordset[0].studentContact);
        const decryptedAddress = await decryptData(result.recordset[0].studentAddress);

        const studentInfo = {
            fullName: decryptedFullName || "unable to decrypt",
            rollNo: decryptedRollNo || "unable to decrypt",
            age: result.recordset[0].age,
            email: decryptedEmail || "unable to decrypt",
            dob: result.recordset[0].dob,
            enrollmentDate: result.recordset[0].enrollmentDate,
            address: decryptedAddress || "unable to decrypt",
            contactMobile: decryptedPhone || "unable to decrypt",
            studentImage: studentImage, 
            totalFees: result.recordset[0].total_fees,
            feesPaid: result.recordset[0].fees_paid,
            feesPending: result.recordset[0].fees_pending,
            transactionInfo: {
                transactionId: result.recordset[0].transaction_id,
                transactionDate: result.recordset[0].transaction_date,
                transactionType: result.recordset[0].transaction_type,
                paymentComplete: result.recordset[0].payment_complete,
                transactionStatus: result.recordset[0].transaction_status,
            },
        };

        // Decrypt sensitive data for parent
        const parentInfo = await Promise.all(result.recordset.map(async (row) => ({
            name: await decryptData(row.parentFullName),
            email: await decryptData(row.parentEmail),
            contactMobile: await decryptData(row.parentContact),
        })));

        const response = {
            studentInfo,
            parentInfo,
        };

        return response;
    } catch (error) {
        console.error('Error fetching student-parent profile: ', error.message);
        throw error;
    }
}

module.exports = {
    getStudentParentProfile,
};
