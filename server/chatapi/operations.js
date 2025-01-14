const NodeCache = require('node-cache');
const { sql, poolPromise } = require('../utils/db');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');
const { Buffer } = require('buffer');

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

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

async function getChatList(studentId) {
    // Check if the result is cached
    const cacheKey = `chatList_${studentId}`;
    const cachedChatList = cache.get(cacheKey);

    if (cachedChatList) {
        console.log('Returning cached chat list for studentId:', studentId);
        return cachedChatList;
    }

    try {
        let pool = await poolPromise;
        const query = `
            SELECT 
                t.teacher_id,
                t.teacher_fullname,
                t.subject_name,
                t.teacher_image,
                t.teacher_type,
                t.semester_number
            FROM 
                TeacherDetails t
            INNER JOIN 
                student_data s
            ON 
                t.semester_id = s.semester_id
                AND t.course_id = s.course_id
            WHERE 
                s.student_id = @studentId
        `;

        const result = await pool.request()
            .input('studentId', sql.NVarChar, studentId)
            .query(query);

        if (result.recordset.length === 0) {
            console.log('No faculty data found');
            return null;
        }

        // Group rows by teacher_id
        const teacherMap = new Map();
        result.recordset.forEach(row => {
            if (!teacherMap.has(row.teacher_id)) {
                teacherMap.set(row.teacher_id, {
                    teacher_id: row.teacher_id,
                    teacher_fullname: row.teacher_fullname,
                    teacher_type: row.teacher_type,
                    teacher_image: row.teacher_image,
                    semester_number: row.semester_number,
                    subject_names: [],
                });
            }
            teacherMap.get(row.teacher_id).subject_names.push(row.subject_name);
        });

        const teachersArray = Array.from(teacherMap.values());
        const encryptedFields = teachersArray.flatMap(teacher => [
            teacher.teacher_fullname,
            teacher.teacher_type,
        ]);

        const decryptedFields = await batchDecryptData(encryptedFields);

        let fieldIndex = 0;
        const chatList = teachersArray.map(teacher => {
            const decryptedTeacherFullname = decryptedFields[fieldIndex++] || "could not decrypt!";
            const decryptedTeacherType = decryptedFields[fieldIndex++] || "could not decrypt!";

            const uniqueSubjectNames = [...new Set(teacher.subject_names)]; // Remove duplicates

            const teacherImageBase64 = teacher.teacher_image
                ? `data:image/jpeg;base64,${Buffer.from(teacher.teacher_image, 'hex').toString('base64')}`
                : null;

            return {
                teacher_id: teacher.teacher_id,
                teacher_fullname: decryptedTeacherFullname,
                teacher_type: decryptedTeacherType,
                subject_name: uniqueSubjectNames.join(', '), // Combine unique subjects into a single string
                teacher_image: teacherImageBase64,
                semester_number: teacher.semester_number,
            };
        });

        // Cache the result for 120 seconds
        cache.set(cacheKey, chatList);

        return chatList;
    } catch (error) {
        console.error('Error fetching chat list:', error.message);
        throw error;
    }
}

module.exports = {
    getChatList,
};
