const { sql, poolPromise } = require('../../utils/db');

async function getStudentAttendanceForCurrentSemester(studentId) {
    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT
                    ms.subject_name,
                    ms.subject_id,
                    COUNT(CASE WHEN da.is_present = 1 THEN 1 END) AS lectures_attended,  -- Count of is_present = 1
                    COUNT(CASE WHEN da.is_present IN (0, 1) THEN 1 END) AS lectures_total  -- Count of is_present = 0 or 1
                FROM student_attendance da
                JOIN master_time_table mt 
                    ON da.time_table_id = mt.time_table_id
                JOIN student_data sd 
                    ON da.student_id = sd.student_id  -- Join on student_id
                JOIN master_subjects ms 
                    ON mt.subject_id = ms.subject_id
                WHERE da.student_id = @studentId
                AND ms.semester_id = sd.semester_id  -- Filter based on student's current semester
                GROUP BY ms.subject_name, ms.subject_id  -- Group by subject to get subject-wise data
                ORDER BY ms.subject_name;  -- Optionally, you can order by subject name or any other field
            `);

        console.log('Database Query Result:', result.recordset);

        if (result.recordset.length === 0) {
            console.log('No data found for the student in the current semester');
            return null;
        }

        // Return transformed subject-wise data with subject names, lectures attended, and total lectures
        const transformedData = result.recordset.map(row => ({
            sub_id: row.subject_id,
            sub_name: row.subject_name,
            lectures_attended: row.lectures_attended,
            lectures_total: row.lectures_total
        }));

        return transformedData;

    } catch (error) {
        console.error('Error fetching student attendance: ', error.message);
        console.error('Error details: ', error);
        throw error;
    }
}

module.exports = {
    getStudentAttendanceForCurrentSemester
};
