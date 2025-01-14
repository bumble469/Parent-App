const { sql, poolPromise } = require('../../utils/db');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 120 });

async function getStudentAttendanceForCurrentSemester(studentId) {
    const cachedAttendance = cache.get(studentId);
    if (cachedAttendance) {
        return cachedAttendance;
    }

    try {
        let pool = await poolPromise;
        let result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT
                    ms.subject_name,
                    ms.subject_id,
                    COUNT(CASE WHEN da.is_present = 1 THEN 1 END) AS lectures_attended,
                    COUNT(CASE WHEN da.is_present IN (0, 1) THEN 1 END) AS lectures_total
                FROM student_attendance da
                JOIN master_time_table mt 
                    ON da.time_table_id = mt.time_table_id
                JOIN student_data sd 
                    ON da.student_id = sd.student_id
                JOIN master_subjects ms 
                    ON mt.subject_id = ms.subject_id
                WHERE da.student_id = @studentId
                AND ms.semester_id = sd.semester_id
                GROUP BY ms.subject_name, ms.subject_id
                ORDER BY ms.subject_name;
            `);

        if (result.recordset.length === 0) {
            return null;
        }

        const transformedData = result.recordset.map(row => ({
            sub_id: row.subject_id,
            sub_name: row.subject_name,
            lectures_attended: row.lectures_attended,
            lectures_total: row.lectures_total
        }));

        cache.set(studentId, transformedData);
        return transformedData;

    } catch (error) {
        console.error('Error fetching student attendance: ', error.message);
        throw error;
    }
}

module.exports = {
    getStudentAttendanceForCurrentSemester
};
