const { sql, poolPromise } = require('../utils/db');
const { Buffer } = require('buffer');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 120 });

async function decryptData(encryptedData) {
    try {
        const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);
        return await callFlaskDecryptAPI(final_data, encrypted_aes_key);
    } catch (error) {
        console.error('Decryption failed: ', error);
        return null;
    }
}

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

async function getStudentParentProfile(studentId) {
    const cachedProfile = cache.get(studentId);
    if (cachedProfile) {
        console.log('Returning cached profile');
        return cachedProfile;
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
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

        const studentData = result.recordset[0];

        const studentImage = studentData.studentImage
            ? `data:image/jpeg;base64,${Buffer.from(studentData.studentImage).toString('base64')}`
            : null;

        const decryptedFullName = await decryptData(studentData.studentFullName);
        const decryptedRollNo = await decryptData(studentData.rollNo);
        const decryptedEmail = await decryptData(studentData.studentEmail);
        const decryptedPhone = await decryptData(studentData.studentContact);
        const decryptedAddress = await decryptData(studentData.studentAddress);

        const dob = formatDate(studentData.dob);
        const enrollmentDate = formatDate(studentData.enrollmentDate);
        const transactionDate = formatDate(studentData.transaction_date);

        const studentInfo = {
            fullName: decryptedFullName || "could not decrypt",
            rollNo: decryptedRollNo || "could not decrypt",
            age: studentData.age,
            email: decryptedEmail || "could not decrypt",
            dob,
            enrollmentDate,
            address: decryptedAddress || "could not decrypt",
            contactMobile: decryptedPhone || "could not decrypt",
            studentImage, 
            totalFees: studentData.total_fees,
            feesPaid: studentData.fees_paid,
            feesPending: studentData.fees_pending,
            transactionInfo: {
                transactionId: studentData.transaction_id,
                transactionDate,
                transactionType: studentData.transaction_type,
                paymentComplete: studentData.payment_complete,
                transactionStatus: studentData.transaction_status,
            },
        };

        const parentInfo = [];
        for (let row of result.recordset) {
            const parent = {
                name: await decryptData(row.parentFullName),
                email: await decryptData(row.parentEmail),
                contactMobile: await decryptData(row.parentContact),
            };
            parentInfo.push(parent);
        }

        const response = {
            studentInfo,
            parentInfo,
        };

        cache.set(studentId, response);

        return response;
    } catch (error) {
        console.error('Error fetching student-parent profile: ', error.message);
        throw error;
    }
}

module.exports = {
    getStudentParentProfile,
};
