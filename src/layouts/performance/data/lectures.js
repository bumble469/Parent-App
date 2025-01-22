import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';
import { useTranslation } from 'react-i18next';
import loading_image from '../../../assets/images/icons8-loading.gif';

const LectureViewTable = ({ semester }) => {
  const [lectureData, setLectureData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); 
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);  // Add state for loading status
  const columnsPerPage = 5;
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language !== 'en';

  const fetchDetailedLectureViews = async (semester) => {
    try {
      setIsLoading(true);  // Set loading to true when the fetch starts
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
      setIsLoading(false);  // Set loading to false when the fetch is complete
    } catch (error) {
      console.error('Error fetching detailed attendance:', error);
      setIsLoading(false);  // Ensure loading is set to false even if there's an error
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
              return { status: t('Not Viewed'), color: 'red', view_time: null };
            } else if (record.viewed_status === 'Viewed') {
              return { status: t('Viewed'), color: 'green', view_time: record.view_time };
            } else {
              return { status: t('Null'), color: 'black', view_time: null };
            }
          });

          if (selectedStatus === 'all' || attendanceStatus[0].status === selectedStatus) {
            row[formattedDate] = attendanceStatus[0];
          }
        } else if (selectedStatus === 'all' || selectedStatus === t('No Lecture')) {
          row[formattedDate] = { status: t('No Lecture'), color: 'black', view_time: null };
        }
      });

      return row;
    });
  }, [lectureData, uniqueDates, selectedSubject, selectedMonth, selectedStatus]);

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
            <div>
              <span style={{ color: value?.color || 'black' }}>{value?.status || ''}</span>
              {value?.view_time && value.status === t('Viewed') && (
                <div style={{ fontSize: isHindi ? '0.95rem' : '0.9rem', color: '#555' }}>
                  {t('on')}: {new Date(value.view_time).toLocaleString()}
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
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={loading_image} alt="Loading..." />
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
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  border: '1px solid #ddd',
                }}
              >
                <option value="all">{t('All Statuses')}</option>
                <option value={t('Viewed')}>{t('Viewed')}</option>
                <option value={t('Not Viewed')}>{t('Not Viewed')}</option>
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
              marginBottom: '1rem',
              fontSize: '1rem',
            }}
          >
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              {t('Previous')}
            </button>
            <span style={{ margin: '0 10px' }}>
              {t('Page')} {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              style={{ padding: '5px 10px', cursor: 'pointer' }}
            >
              {t('Next')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LectureViewTable;
