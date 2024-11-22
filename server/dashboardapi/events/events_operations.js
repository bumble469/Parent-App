const { sql, poolPromise } = require('../../utils/db');

async function getEvents() {
    try {
        let pool = await poolPromise; 
        
        let result = await pool.request().query(`
            SELECT event_id, event_name, event_date, event_time, venue from events
        `);
        
        console.log('Database Query Result:', result.recordset);
        
        if (result.recordset.length === 0) {
            console.log('No events found');
            return [];
        }

        const eventData = result.recordset.map(row => ({
            event_id: row.event_id,
            event_name: row.event_name,
            event_date: row.event_date,
            event_time: row.event_time,
            venue: row.venue,
        }));

        return eventData;
    } catch (error) {
        console.error('Error fetching events: ', error.message); // Log the error message for better clarity
        console.error('Error details: ', error); // Log the entire error object for more details
        throw error; 
    }
}


module.exports = {
    getEvents
};
