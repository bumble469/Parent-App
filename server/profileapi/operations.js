const { sql, poolPromise } = require('../utils/db');
const { Buffer } = require('buffer');

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

        // Convert the student image from binary to Base64
        const studentImage = result.recordset[0].studentImage
            ? `data:image/jpeg;base64,${Buffer.from(result.recordset[0].studentImage).toString('base64')}`
            : null;

        const studentInfo = {
            fullName: result.recordset[0].studentFullName,
            rollNo: result.recordset[0].rollNo,
            age: result.recordset[0].age,
            email: result.recordset[0].studentEmail,
            dob: result.recordset[0].dob,
            enrollmentDate: result.recordset[0].enrollmentDate,
            address: result.recordset[0].studentAddress,
            contactMobile: result.recordset[0].studentContact,
            studentImage: studentImage, // Base64 encoded image
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

        const parentInfo = result.recordset.map(row => ({
            name: row.parentFullName,
            email: row.parentEmail,
            contactMobile: row.parentContact,
        }));

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
