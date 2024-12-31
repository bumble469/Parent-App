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

async function getLectureViewsForStudent(studentId, semester) {
    try {
        let pool = await poolPromise;

        // Modify the query to join with student_data based on course_id and semester
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('semester', sql.Int, semester)  // Add semester as input
            .query(`
                SELECT 
                    lv.student_id,
                    lv.lecture_id,
                    lv.lecture_videos_id,
                    lv.viewed_status,
                    lv.view_time,
                    lv.lecture_date,
                    lv.subject_name,
                    lv.status
                FROM vw_LectureDetails lv
                WHERE lv.student_id = @studentId
                AND semester_id = @semester 
                ORDER BY lv.lecture_id;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log(`No data found for student ${studentId} in semester ${semester}`);
            return null;  // No data found for the student in the current semester
        }

        const lectureViewsArray = result.recordset; // All rows for the student

        // Extract the encrypted viewed_status field for decryption
        const encryptedViewedStatus = lectureViewsArray.map(view => view.viewed_status);

        // Decrypt the viewed_status fields
        const decryptedViewedStatus = await batchDecryptData(encryptedViewedStatus);

        let fieldIndex = 0;
        const lectureViewsData = lectureViewsArray.map(view => {
            const decryptedStatus = decryptedViewedStatus[fieldIndex++] || "could not decrypt!";

            // Return the full data with decrypted viewed_status and course_id
            return {
                student_id: view.student_id,
                lecture_id: view.lecture_id,
                lecture_videos_id: view.lecture_videos_id,
                viewed_status: view.viewed_status,
                view_time: view.view_time,
                status: view.status,
                course_id: view.course_id,
                subject_name: view.subject_name,
                lecture_date: view.lecture_date
            };
        });

        return lectureViewsData; // Return the full lecture views data
    } catch (error) {
        console.error('Error fetching student lecture views details: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getLectureViewsForStudent
};
