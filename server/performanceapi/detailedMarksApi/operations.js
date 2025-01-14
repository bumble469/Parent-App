const NodeCache = require('node-cache');
const { sql, poolPromise } = require('../../utils/db');
const { callFlaskDecryptAPI } = require('../../utils/flask_api_call/flask_api_call');

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

async function decryptData(encryptedData) {
    try {
        const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);
        const cacheKey = `${final_data}_${encrypted_aes_key}`; // Cache key

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const decryptedData = await callFlaskDecryptAPI(final_data, encrypted_aes_key);

        cache.set(cacheKey, decryptedData);

        return decryptedData;
    } catch (error) {
        console.error("Decryption failed: ", error.message);
        return "could not decrypt!";
    }
}

async function batchDecryptData(encryptedDataArray) {
    const decryptedDataArray = await Promise.all(
        encryptedDataArray.map(decryptData) 
    );
    return decryptedDataArray;
}

async function getStudentDetailedMarksForPerformance(studentId, semester) {
    try {
        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('semester', sql.Int, semester)
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
            return null;
        }

        const performanceArray = result.recordset;

        const encryptedExamTypes = performanceArray.map(performance => performance.exam_type);
        const decryptedExamTypes = await batchDecryptData(encryptedExamTypes);

        let fieldIndex = 0;
        const studentPerformanceData = performanceArray.map(performance => {
            const decryptedExamType = decryptedExamTypes[fieldIndex++] || "could not decrypt!";

            return {
                student_id: performance.student_id,
                subject_id: performance.subject_id,
                semester_id: performance.semester_id,
                subject_name: performance.subject_name, 
                exam_type: decryptedExamType,
                marks_obtained: performance.marks_obtained,
                max_marks: performance.max_marks
            };
        });

        return studentPerformanceData;
    } catch (error) {
        console.error('Error fetching student performance details: ', error.message);
        throw error;
    }
}

module.exports = {
    getStudentDetailedMarksForPerformance
};
