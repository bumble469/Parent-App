const { sql, poolPromise } = require('../../utils/db');
const { callFlaskDecryptAPI } = require('../../utils/flask_api_call/flask_api_call');

async function batchDecryptData(encryptedDataArray) {
    try {
        const decryptedDataArray = await Promise.all(
            encryptedDataArray.map(async (encryptedData) => {
                try {
                    const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);
                    return await callFlaskDecryptAPI(final_data, encrypted_aes_key);
                } catch (error) {
                    console.error('Batch Decryption failed: ', error.message);
                    return null;
                }
            })
        );
        return decryptedDataArray;
    } catch (error) {
        console.error('Error in batch decryption: ', error.message);
        throw error;
    }
}

async function getStudentDetailedMarksForPerformance(studentId, semester) {
    try {
        let pool = await poolPromise;

        // Modify the query to select the data from StudentPerformance based on studentId and semester
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('semester', sql.Int, semester)  // Add semester as input
            .query(`
               SELECT 
                    sp.student_id,
                    sp.subject_id,
                    sp.semester_id,
                    sp.subject_name,
                    sp.exam_type,
                    sp.marks_obtained,
                    sp.max_marks
               FROM vw_student_performance sp
               WHERE sp.student_id = @studentId
               AND sp.semester_id = @semester
               ORDER BY sp.subject_id;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log(`No data found for student ${studentId} in semester ${semester}`);
            return null;  // No data found for the student in the current semester
        }

        const performanceArray = result.recordset; // All rows for the student

        // Extract only the exam_type field for decryption (subject_name remains unchanged)
        const encryptedExamTypes = performanceArray.map(performance => performance.exam_type);

        // Decrypt the exam_type fields
        const decryptedExamTypes = await batchDecryptData(encryptedExamTypes);

        let fieldIndex = 0;
        const studentPerformanceData = performanceArray.map(performance => {
            const decryptedExamType = decryptedExamTypes[fieldIndex++] || "could not decrypt!";

            // Return the full data with decrypted exam_type (subject_name remains as is)
            return {
                student_id: performance.student_id,
                subject_id: performance.subject_id,
                semester_id: performance.semester_id,
                subject_name: performance.subject_name,  // No decryption for subject_name
                exam_type: decryptedExamType,
                marks_obtained: performance.marks_obtained,
                max_marks: performance.max_marks
            };
        });

        return studentPerformanceData; // Return the full performance data
    } catch (error) {
        console.error('Error fetching student performance details: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentDetailedMarksForPerformance
};
