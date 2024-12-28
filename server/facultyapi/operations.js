const NodeCache = require('node-cache');
const { sql, poolPromise } = require('../utils/db');
const { callFlaskDecryptAPI } = require('../utils/flask_api_call/flask_api_call');
const { Buffer } = require('buffer');

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

async function batchDecryptData(encryptedDataArray) {
    const batchSize = 50;
    let decryptedDataArray = [];

    try {
        const chunks = chunkArray(encryptedDataArray, batchSize);

        const decryptedChunks = await Promise.all(
            chunks.map(async (chunk) => {
                return await Promise.all(
                    chunk.map(async (encryptedData) => {
                        try {
                            const { final_data, encrypted_aes_key } = JSON.parse(encryptedData);

                            // Check if the decrypted data is already cached
                            const cacheKey = `${final_data}_${encrypted_aes_key}`; // Unique cache key based on data
                            const cachedData = cache.get(cacheKey);
                            if (cachedData) {
                                return cachedData; // Return cached decrypted data
                            }

                            // If not cached, call Flask API to decrypt
                            const decryptedData = await callFlaskDecryptAPI(final_data, encrypted_aes_key);

                            // Cache the decrypted data
                            cache.set(cacheKey, decryptedData);

                            return decryptedData;
                        } catch (error) {
                            console.error('Decryption failed for data:', encryptedData, error.message);
                            return null;
                        }
                    })
                );
            })
        );

        decryptedDataArray = decryptedChunks.flat();

        return decryptedDataArray;
    } catch (error) {
        console.error('Error in batch decryption:', error.message);
        throw error;
    }
}

async function getFaculty() {
    try {
        let pool = await poolPromise;

        let result = await pool.request().query(`
            SELECT 
                teacher_fullname,
                teacher_type,
                teacher_image,
                course_name,
                semester_number,
                subject_name
            FROM TeacherDetails;
        `);

        if (result.recordset.length === 0) {
            console.log('No faculty data found');
            return null;
        }

        const encryptedFields = result.recordset.flatMap(row => [
            row.teacher_fullname,
            row.teacher_type,
            row.course_name,
            row.teacher_image
        ]);

        const decryptedFields = await batchDecryptData(encryptedFields);

        const facultyData = result.recordset.map((row, index) => {
            const decryptedTeacherFullname = decryptedFields[index * 4] || "could not decrypt!";
            const decryptedTeacherType = decryptedFields[index * 4 + 1] || "could not decrypt!";
            const decryptedCourseName = decryptedFields[index * 4 + 2] || "could not decrypt!";
            const decryptedTeacherImage = decryptedFields[index * 4 + 3];

            const teacherImageBase64 = decryptedTeacherImage
                ? `data:image/jpeg;base64,${Buffer.from(decryptedTeacherImage, 'hex').toString('base64')}`
                : null;

            return {
                teacher_fullname: decryptedTeacherFullname,
                teacher_type: decryptedTeacherType,
                course_name: decryptedCourseName,
                subject_name: row.subject_name,
                teacher_image: teacherImageBase64,
                semester_number: row.semester_number
            };
        });

        return facultyData;

    } catch (error) {
        console.error('Error while fetching faculty data:', error.message);
        throw error;
    }
}

module.exports = {
    getFaculty
};
