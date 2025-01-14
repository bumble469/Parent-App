const { sql, poolPromise } = require('../../utils/db');
const { callFlaskDecryptAPI } = require('../../utils/flask_api_call/flask_api_call');
const NodeCache = require('node-cache');

const eventCache = new NodeCache({ stdTTL: 120 });

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

async function getEvents(studentId) {
    try {
        const cachedEvents = eventCache.get(studentId);
        if (cachedEvents) {
            console.log('Returning cached events data');
            return cachedEvents;
        }

        let pool = await poolPromise;

        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT 
                    subject_name, 
                    teacher_fullname, 
                    lecture_date, 
                    lecture_location, 
                    lecture_time, 
                    lecture_day, 
                    is_holiday
                FROM (
                    SELECT 
                        subject_name, 
                        teacher_fullname, 
                        lecture_date, 
                        lecture_location, 
                        lecture_time, 
                        lecture_day, 
                        is_holiday,
                        ROW_NUMBER() OVER (PARTITION BY subject_name ORDER BY lecture_date DESC) AS rn
                    FROM vw_master_timetable vt
                    INNER JOIN student_data s
                        ON vt.semester_id = s.semester_id
                    WHERE s.student_id = @studentId
                ) AS LatestWeekData
                WHERE rn = 1
                ORDER BY lecture_date DESC;
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No events found');
            return [];
        }

        const batchSize = 100;
        const eventData = [];

        for (let i = 0; i < result.recordset.length; i += batchSize) {
            const batch = result.recordset.slice(i, i + batchSize);
            const decryptedBatch = await Promise.all(batch.map(async (row) => {
                const decryptedTeacherName = await decryptData(row.teacher_fullname);
                return {
                    subject_name: row.subject_name,
                    teacher_fullname: decryptedTeacherName || 'no data or decryption failed',
                    lecture_date: row.lecture_date,
                    lecture_location: row.lecture_location,
                    lecture_time: row.lecture_time,
                    lecture_day: row.lecture_day,
                    is_holiday: row.is_holiday
                };
            }));

            eventData.push(...decryptedBatch);
        }

        eventCache.set(studentId, eventData);

        return eventData;
    } catch (error) {
        console.error('Error fetching events: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getEvents
};
