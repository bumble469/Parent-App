const { sql, poolPromise } = require('../../utils/db');
const { callFlaskDecryptAPI } = require('../../utils/flask_api_call/flask_api_call');
const NodeCache = require('node-cache');

const timetableCache = new NodeCache({ stdTTL: 120 }); // Cache for timetable data

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

async function getTimetable() {
    try {
        // Check if the timetable is cached
        const cachedTimetable = timetableCache.get('default_timetable');
        if (cachedTimetable) {
            console.log('Returning cached timetable data');
            return cachedTimetable;
        }

        // Fetch the timetable from the database without using studentId
        let pool = await poolPromise;
        let result = await pool.request().query(`
            SELECT TOP (1000) 
                [time_table_id],
                [subject_id],
                [subject_name],
                [teacher_fullname],
                [lecture_type],
                [day_name],
                [lecture_timing],
                [week_number]
            FROM [psat_final].[dbo].[vw_latest_timetable]
            ORDER BY [week_number], [day_name], [lecture_timing];
        `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No timetable found');
            return [];
        }

        // Process the timetable data and decrypt the teacher's name
        const timetableData = await Promise.all(result.recordset.map(async (row) => {
            const decryptedTeacherName = await decryptData(row.teacher_fullname);
            return {
                subject_name: row.subject_name,
                teacher_fullname: decryptedTeacherName || 'no data or decryption failed',
                lecture_type: row.lecture_type,
                day_name: row.day_name,
                lecture_timing: row.lecture_timing,
                week_number: row.week_number,
            };
        }));

        // Cache the result for future requests
        timetableCache.set('default_timetable', timetableData);

        return timetableData;
    } catch (error) {
        console.error('Error fetching timetable: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getTimetable
};
