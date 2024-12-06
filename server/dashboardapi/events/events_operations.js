const { sql, poolPromise } = require('../../utils/db');

async function getEvents(studentId) {
    try {
        let pool = await poolPromise;

        // Query the view to get the specific columns, filtered by student_id
        let result = await pool.request()
            .input('studentId', sql.Int, studentId) // Pass the studentId parameter
            .query(`
                SELECT 
                    subject_name, 
                    teacher_fullname, 
                    lecture_date, 
                    lecture_location, 
                    lecture_time, 
                    lecture_day, 
                    is_holiday
                FROM vw_master_timetable vt
                INNER JOIN student_data s
                    ON vt.semester_id = s.semester_id
                WHERE s.student_id = @studentId
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No events found');
            return [];
        }

        // Mapping the result to the desired format
        const eventData = result.recordset.map(row => ({
            subject_name: row.subject_name,
            teacher_fullname: row.teacher_fullname,
            lecture_date: row.lecture_date,
            lecture_location: row.lecture_location,
            lecture_time: row.lecture_time,
            lecture_day: row.lecture_day,
            is_holiday: row.is_holiday,
        }));

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
