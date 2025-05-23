import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';
import { useTranslation } from 'react-i18next';
import loading_image from '../../../assets/images/icons8-loading.gif';
import axios from 'axios';
const AttendanceTable = ({ prn, semester }) => {
  const { t } = useTranslation();

  const [attendanceData, setAttendanceData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const columnsPerPage = 8;
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const fetchDetailedAttendance = async (semester) => {
    setLoading(true);
    try {
      const response = await axios.post(`${REST_API_URL}/api/performance/student/detailedattendance`,{
        prn:prn,
        semester:semester
      });
      const data = response.data;

      const groupedData = data.reduce((acc, { subject_name, scan_time, is_present }) => {
        const parsedDate = new Date(scan_time);
        if (isNaN(parsedDate)) return acc;

        if (!acc[subject_name]) {
          acc[subject_name] = [];
        }
        acc[subject_name].push({ date: parsedDate, is_present });
        return acc;
      }, {});

      setAttendanceData(groupedData);
    } catch (error) {
      console.error('Error fetching detailed attendance:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchDetailedAttendance(semester);
  }, [semester]);

  const resetFilters = () => {
    setSelectedSubject('all');
    setSelectedMonth('');
    setSelectedStatus('all');
    setCurrentPage(0);
  };

  const allDates = Object.values(attendanceData)
    .flat()
    .map((item) => item.date);
    const uniqueDates = Array.from(
      new Set(
        allDates
          .sort((a, b) => a - b) // Sort dates in ascending order
          .map((date) => {
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
            if (record.is_present === null || record.is_present === undefined) {
              return { status: t('No Lecture'), color: 'black' };
            }
            return record.is_present
              ? { status: t('Present'), color: 'green' }
              : { status: t('Absent'), color: 'red' };
          });

          if (selectedStatus === 'all' || attendanceStatus[0].status === selectedStatus) {
            row[formattedDate] = attendanceStatus[0];
          }
        } else if (selectedStatus === 'all' || selectedStatus === 'No Lecture') {
          row[formattedDate] = { status: t('No Lecture'), color: 'black' };
        }
      });

      return row;
    });
  }, [attendanceData, uniqueDates, selectedSubject, selectedMonth, selectedStatus, t]);

  const columns = useMemo(() => {
    return [
      { Header: t('subject'), accessor: 'subject' },
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
  }, [uniqueDates, selectedMonth, t]);

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
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <img src={loading_image} alt="Loading..." style={{ width: '50px', height: '50px' }}/>
        </div>
      ) : (
        <>
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
              {t('Clear Filters')}
            </button>

            <div style={{ display: 'flex', gap: '10px', marginRight: '1rem' }}>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  border: '1px solid #ddd',
                }}
              >
                <option value="all">{t('All Subjects')}</option>
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
                  fontSize: '0.95rem',
                  border: '1px solid #ddd',
                }}
              >
                <option value="">{t('All Months')}</option>
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
                  fontSize: '0.95rem',
                  border: '1px solid #ddd',
                }}
              >
                <option value='all'>{t('All Statuses')}</option>
                <option value={t('Present')}>{t('Present')}</option>
                <option value={t('Absent')}>{t('Absent')}</option>
                <option value={t('No Lecture')}>{t('No Lecture')}</option>
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
                fontSize: '0.95rem',
                transition: 'background-color 0.3s ease',
              }}
            >
              {t('Previous')}
            </button>
            <span
              style={{
                fontSize: '1rem',
                color: '#333',
              }}
            >
              {t('Page')} {currentPage + 1} {t('of')} {totalPages}
            </span>
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
                fontSize: '0.95rem',
                transition: 'background-color 0.3s ease',
              }}
            >
              {t('Next')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceTable;
