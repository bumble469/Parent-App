import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';

const LectureViewTable = ({ semester }) => {
  const [lectureData, setLectureData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // New dropdown state
  const [currentPage, setCurrentPage] = useState(0);
  const columnsPerPage = 5;

  const fetchDetailedLectureViews = async (semester) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/performance/student/lectureviews?semester=${semester}`
      );
      const data = await response.json();

      const groupedData = data.reduce((acc, { subject_name, lecture_date, viewed_status, view_time }) => {
        const parsedDate = new Date(lecture_date);
        if (isNaN(parsedDate)) return acc;

        if (!acc[subject_name]) {
          acc[subject_name] = [];
        }
        acc[subject_name].push({ date: parsedDate, viewed_status, view_time });
        return acc;
      }, {});

      setLectureData(groupedData);
    } catch (error) {
      console.error('Error fetching detailed attendance:', error);
    }
  };

  useEffect(() => {
    fetchDetailedLectureViews(semester);
  }, [semester]);

  const resetFilters = () => {
    setSelectedSubject('all');
    setSelectedMonth('');
    setSelectedStatus('all');
    setCurrentPage(0);
  };

  const allDates = Object.values(lectureData)
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

    const subjects = selectedSubject === 'all' ? Object.keys(lectureData) : [selectedSubject];

    return subjects.map((subject) => {
      const subjectData = lectureData[subject] || [];
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
            if (record.viewed_status === 'Not Viewed') {
              return { status: 'Not Viewed', color: 'red', view_time: null };
            } else if (record.viewed_status === 'Viewed') {
              return { status: 'Viewed', color: 'green', view_time: record.view_time };
            } else {
              return { status: 'Null', color: 'black', view_time: null };
            }
          });

          if (selectedStatus === 'all' || attendanceStatus[0].status === selectedStatus) {
            row[formattedDate] = attendanceStatus[0];
          }
        } else if (selectedStatus === 'all' || selectedStatus === 'No Lecture') {
          row[formattedDate] = { status: 'No Lecture', color: 'black', view_time: null };
        }
      });

      return row;
    });
  }, [lectureData, uniqueDates, selectedSubject, selectedMonth, selectedStatus]);

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
            <div>
              <span style={{ color: value?.color || 'black' }}>{value?.status || ''}</span>
              {value?.view_time && value.status === 'Viewed' && (
                <div style={{ fontSize: '0.8rem', color: '#555' }}>
                  on: {new Date(value.view_time).toLocaleString()}
                </div>
              )}
            </div>
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
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={resetFilters}
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '5px 10px',
            borderRadius: '3px',
            border: '1px solid #f5c6cb',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginLeft: '1rem',
          }}
        >
          Clear Filters
        </button>

        <div style={{ display: 'flex', gap: '10px', marginRight: '1rem' }}>
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
            {Object.keys(lectureData).map((subject) => (
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
            <option value="">All Months</option>
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
            <option value="Viewed">Viewed</option>
            <option value="Not Viewed">Not Viewed</option>
            <option value="No Lecture">No Lecture</option>
          </select>
        </div>
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
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage >= totalPages - 1 ? '#d3d3d3' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Next
        </button>
        <span
          style={{
            fontSize: '1rem',
            color: '#333',
          }}
        >
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default LectureViewTable;
