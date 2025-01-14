const { sql, poolPromise } = require('../../utils/db');
const { callFlaskDecryptAPI } = require('../../utils/flask_api_call/flask_api_call');
const NodeCache = require('node-cache');

const lectureViewsCache = new NodeCache({ stdTTL: 120 });

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
        const cacheKey = `${studentId}-${semester}`;
        const cachedData = lectureViewsCache.get(cacheKey);
        if (cachedData) {
            console.log('Returning cached lecture views data');
            return cachedData;
        }

        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('semester', sql.Int, semester)
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
            return null; 
        }

        const lectureViewsArray = result.recordset;

        const encryptedViewedStatus = lectureViewsArray.map(view => view.viewed_status);

        const decryptedViewedStatus = await batchDecryptData(encryptedViewedStatus);

        let fieldIndex = 0;
        const lectureViewsData = lectureViewsArray.map(view => {
            const decryptedStatus = decryptedViewedStatus[fieldIndex++] || "could not decrypt!";

            return {
                student_id: view.student_id,
                lecture_id: view.lecture_id,
                lecture_videos_id: view.lecture_videos_id,
                viewed_status: view.viewed_status,
                view_time: view.view_time,
                status: view.status,
                subject_name: view.subject_name,
                lecture_date: view.lecture_date
            };
        });

        lectureViewsCache.set(cacheKey, lectureViewsData);

        return lectureViewsData;
    } catch (error) {
        console.error('Error fetching student lecture views details: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getLectureViewsForStudent
};
