import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';

const AttendanceTable = ({ semester }) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // New dropdown state
  const [currentPage, setCurrentPage] = useState(0);
  const columnsPerPage = 8;

  const fetchDetailedAttendance = async (semester) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/performance/student/detailedattendance?semester=${semester}`
      );
      const data = await response.json();

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
      console.error('Error fetching detailed attendance:', error);
    }
  };

  useEffect(() => {
    fetchDetailedAttendance(semester);
  }, [semester]);

  const allDates = Object.values(attendanceData)
    .flat()
    .map((item) => item.date);
  const uniqueDates = Array.from(
    new Set(
      allDates.map((date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      })
    )
  );

  const uniqueMonths = Array.from(
    new Set(
      allDates.map((date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${year}`;
      })
    )
  );

  const tableData = useMemo(() => {
    const filteredDates = uniqueDates.filter((formattedDate) => {
      if (!selectedMonth) return true;
      const [day, month, year] = formattedDate.split('/');
      return `${month}/${year}` === selectedMonth;
    });

    const subjects = selectedSubject === 'all' ? Object.keys(attendanceData) : [selectedSubject];

    return subjects.map((subject) => {
      const subjectData = attendanceData[subject] || [];
      const row = { subject };

      filteredDates.forEach((formattedDate) => {
        const [day, month, year] = formattedDate.split('/');
        const monthIndex = parseInt(month) - 1;
        const dayIndex = parseInt(day);

        const attendanceRecord = subjectData.filter((item) => {
          const recordDate = item.date;
          return (
            recordDate.getDate() === dayIndex &&
            recordDate.getMonth() === monthIndex &&
            recordDate.getFullYear() === parseInt(year)
          );
        });

        if (attendanceRecord.length > 0) {
          const attendanceStatus = attendanceRecord.map((record) => {
            if (record.attended === null || record.attended === undefined) {
              return { status: 'No Lecture', color: 'black' };
            }
            return record.attended
              ? { status: 'Present', color: 'green' }
              : { status: 'Absent', color: 'red' };
          });

          if (selectedStatus === 'all' || attendanceStatus[0].status === selectedStatus) {
            row[formattedDate] = attendanceStatus[0];
          }
        } else if (selectedStatus === 'all' || selectedStatus === 'No Lecture') {
          row[formattedDate] = { status: 'No Lecture', color: 'black' };
        }
      });

      return row;
    });
  }, [attendanceData, uniqueDates, selectedSubject, selectedMonth, selectedStatus]);

  const columns = useMemo(() => {
    return [
      { Header: 'Subject', accessor: 'subject' },
      ...uniqueDates
        .filter((date) => {
          if (!selectedMonth) return true;
          const [, month, year] = date.split('/');
          return `${month}/${year}` === selectedMonth;
        })
        .map((date) => ({
          Header: date,
          accessor: date,
          Cell: ({ value }) => (
            <span style={{ color: value?.color || 'black' }}>{value?.status || ''}</span>
          ),
        })),
    ];
  }, [uniqueDates, selectedMonth]);

  const paginatedColumns = columns.slice(
    currentPage * columnsPerPage,
    (currentPage + 1) * columnsPerPage
  );
  const totalPages = Math.ceil(columns.length / columnsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #ddd',
          }}
        >
          <option value="all">All Subjects</option>
          {Object.keys(attendanceData).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #ddd',
          }}
        >
          <option value="">Select Month</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            border: '1px solid #ddd',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="No Lecture">No Lecture</option>
        </select>
      </div>

      <DataTable
        table={{
          columns: paginatedColumns,
          rows: tableData,
        }}
        isSorted={true}
        entriesPerPage={false}
        showTotalEntries={false}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '15px',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
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
            backgroundColor:
              currentPage === totalPages - 1 ? '#d3d3d3' : '#007bff',
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
