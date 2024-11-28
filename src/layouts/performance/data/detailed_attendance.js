import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';

const AttendanceTable = ({ semester }) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Fetch attendance data for the selected semester
  const fetchDetailedAttendance = async (semester) => {
    try {
      const response = await fetch(`http://localhost:8080/api/performance/student/detailedattendance?semester=${semester}`);
      const data = await response.json();

      console.log('Fetched data:', data); // Log the fetched data

      // Group data by subject and attendance date
      const groupedData = data.reduce((acc, { name, attendance_date, attended }) => {
        // Convert the date string to a Date object
        const parsedDate = new Date(attendance_date);

        // If the date is invalid, skip this entry
        if (isNaN(parsedDate)) {
          console.warn(`Invalid date found for ${name} on ${attendance_date}`);
          return acc;
        }

        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push({ date: parsedDate, attended });
        return acc;
      }, {});

      console.log("Grouped Data:", groupedData); // Log grouped data
      setAttendanceData(groupedData);
    } catch (error) {
      console.error("Error fetching detailed attendance:", error);
    }
  };

  useEffect(() => {
    fetchDetailedAttendance(semester);
  }, [semester]);

  // Get all dates and group them by day, month, and year (dd/mm/yyyy)
  const allDates = Object.values(attendanceData).flat().map(item => item.date);

  console.log("All Dates:", allDates); // Log all date objects to check if they are valid

  // Filter unique dates in dd/mm/yyyy format
  const uniqueDates = Array.from(new Set(allDates.map(date => {
    // Format the date as dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  })));

  console.log("Unique Dates:", uniqueDates); // Log unique dates for debugging

  // Get unique months for the filter
  const uniqueMonths = Array.from(new Set(allDates.map(date => {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Format month as dd/mm/yyyy
    const year = date.getFullYear();
    return `${month}/${year}`; // Use month/year format
  })));

  // Prepare data for DataTable
  const tableData = Object.keys(attendanceData).map((subject) => {
    const row = { subject };

    // Generate date headers for each formatted date (e.g., 01/01/2024, 02/01/2024)
    uniqueDates.forEach((formattedDate) => {
      const [day, month, year] = formattedDate.split('/');
      const monthIndex = parseInt(month) - 1; // Convert month to zero-indexed
      const dayIndex = parseInt(day);

      // Find attendance record for the specific date
      const attendanceRecord = attendanceData[subject].filter(item => {
        const recordDate = item.date;
        if (!(recordDate instanceof Date)) {
          console.warn(`Invalid recordDate for subject ${subject}:`, recordDate);
          return false;
        }
        return recordDate.getDate() === dayIndex && recordDate.getMonth() === monthIndex && recordDate.getFullYear() === parseInt(year);
      });

      // For dates that have no attendance data, or null attendance, mark as 'No Lecture'
      if (attendanceRecord.length > 0) {
        const sortedRecords = attendanceRecord.sort((a, b) => a.date - b.date);

        // Check for null or undefined attendance and mark as 'No Lecture' for such records
        const attendanceStatus = sortedRecords.map(record => {
          if (record.attended === null || record.attended === undefined) {
            return 'No Lecture';
          }
          return record.attended ? 'Present' : 'Absent';
        });

        row[formattedDate] = attendanceStatus.join(',  '); // Combine multiple attendance statuses for the date
      } else {
        row[formattedDate] = 'No Lecture'; // If no attendance data for the date, mark as 'No Lecture'
      }
    });

    return row;
  });

  console.log("Table Data:", tableData); // Log final table data

  const columns = useMemo(
    () => [
      { Header: 'Subject', accessor: 'subject' },
      ...uniqueDates.map((date) => ({ Header: date, accessor: date }))
    ],
    [uniqueDates]
  );

  // Filter tableData based on selected month and subject
  const filteredData = tableData.filter(row => {
    const isMonthFiltered = selectedMonth
      ? Object.keys(row).some(date => {
          // Skip 'subject' key
          if (date === 'subject') return false;
  
          // Extract the month/year part from the formatted date (e.g., '01/01/2024' -> '01/2024')
          const [day, month, year] = date.split('/');
          const formattedDateMonth = `${month}/${year}`; // 'MM/YYYY' format
          
          // Check if the month/year matches the selected month
          return formattedDateMonth === selectedMonth;
        })
      : true; // If no month is selected, don't filter by month
  
    const isSubjectFiltered = selectedSubject
      ? row.subject === selectedSubject
      : true;
  
    return isMonthFiltered && isSubjectFiltered;
  });  
    
  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', fontSize: '14px', marginRight: '10px', border: '1px solid #ddd' }}
        >
          <option value="">All Months</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd', marginRight: "20px" }}
        >
          <option value="">All Subjects</option>
          {Object.keys(attendanceData).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* DataTable */}
      <DataTable
        table={{ columns: columns, rows: filteredData }}
        isSorted={false}
        entriesPerPage={true}
        showTotalEntries={true}
        noEndBorder
      />
    </div>
  );
};

export default AttendanceTable;
