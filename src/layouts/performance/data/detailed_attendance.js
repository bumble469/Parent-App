import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';

const AttendanceTable = ({ semester }) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const columnsPerPage = 8; // Number of columns to display per page

  // Fetch attendance data for the selected semester
  const fetchDetailedAttendance = async (semester) => {
    try {
      const response = await fetch(`http://localhost:8080/api/performance/student/detailedattendance?semester=${semester}`);
      const data = await response.json();

      // Group data by subject and attendance date
      const groupedData = data.reduce((acc, { name, attendance_date, attended }) => {
        const parsedDate = new Date(attendance_date);
        if (isNaN(parsedDate)) return acc;

        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push({ date: parsedDate, attended });
        return acc;
      }, {});

      setAttendanceData(groupedData);
    } catch (error) {
      console.error("Error fetching detailed attendance:", error);
    }
  };

  useEffect(() => {
    fetchDetailedAttendance(semester);
  }, [semester]);

  // Get all dates and generate unique dates in dd/mm/yyyy format
  const allDates = Object.values(attendanceData).flat().map(item => item.date);
  const uniqueDates = Array.from(new Set(allDates.map(date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  })));

  // Prepare table data: rows will be subjects, and columns will be dates
  const tableData = useMemo(() => {
    if (selectedSubject) {
      const subjectData = attendanceData[selectedSubject] || [];
      const row = { subject: selectedSubject };

      uniqueDates.forEach((formattedDate) => {
        const [day, month, year] = formattedDate.split('/');
        const monthIndex = parseInt(month) - 1;
        const dayIndex = parseInt(day);

        const attendanceRecord = subjectData.filter(item => {
          const recordDate = item.date;
          return recordDate.getDate() === dayIndex && recordDate.getMonth() === monthIndex && recordDate.getFullYear() === parseInt(year);
        });

        if (attendanceRecord.length > 0) {
          const sortedRecords = attendanceRecord.sort((a, b) => a.date - b.date);
          const attendanceStatus = sortedRecords.map(record => {
            if (record.attended === null || record.attended === undefined) {
              return 'No Lecture';
            }
            return record.attended ? 'Present' : 'Absent';
          });
          row[formattedDate] = attendanceStatus.join(', ');
        } else {
          row[formattedDate] = 'No Lecture';
        }
      });

      return [row]; // Only return data for the selected subject
    }

    return []; // If no subject is selected, return empty data
  }, [attendanceData, uniqueDates, selectedSubject]);

  // Columns configuration for DataTable
  const columns = useMemo(() => {
    return [
      { Header: 'Subject', accessor: 'subject' },
      ...uniqueDates.map(date => ({ Header: date, accessor: date }))
    ];
  }, [uniqueDates]);

  // Paginate the columns
  const paginatedColumns = columns.slice(currentPage * columnsPerPage, (currentPage + 1) * columnsPerPage);
  const totalPages = Math.ceil(columns.length / columnsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd', marginRight: "20px" }}
        >
          <option value="">Select Subject</option>
          {Object.keys(attendanceData).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      {/* DataTable */}
      <DataTable
        table={{
          columns: paginatedColumns,
          rows: tableData 
        }}
        isSorted={true}
        entriesPerPage={false}
        showTotalEntries={false}
      />
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '15px', 
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <button 
          onClick={goToPreviousPage} 
          disabled={currentPage === 0} 
          style={{
            padding: '8px 16px', 
            backgroundColor: currentPage === 0 ? '#d3d3d3' : '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            transition: 'background-color 0.3s ease',
          }}
        >
          Previous
        </button>
        
        <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages - 1} 
          style={{
            padding: '8px 16px', 
            backgroundColor: currentPage === totalPages - 1 ? '#d3d3d3' : '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', 
            fontSize: '14px', 
            transition: 'background-color 0.3s ease',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
