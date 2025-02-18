import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Icon from '@mui/material/Icon';
import axios from 'axios';
import DataTable from 'examples/Tables/DataTable';
import { useTranslation } from 'react-i18next';
import loading_image from '../../../assets/images/icons8-loading.gif';

export default function Data() {
  const [events, setEvents] = useState([]); // State to store events
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const { t } = useTranslation();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0); // Initial page number
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  
  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/events/events'); // Adjust the URL based on your API
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          throw new Error('Invalid data format'); // Throw error for unexpected data structure
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        const message = err.response
          ? `Error: ${err.response.status} - ${err.response.statusText}`
          : 'Network error. Please try again later.';
        setError(message); // Set error state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, []); // Runs once when the component mounts

  // Prepare rows for the DataTable
  const rows = (events || []).map((event) => ({
    subject_name: event.subject_name, // Display subject name
    teacher_fullname: event.teacher_fullname, // Display teacher's name
    lecture_date: new Date(event.lecture_timing).toLocaleDateString(), // Format lecture date
    lecture_time: new Date(event.lecture_timing).toLocaleTimeString(), // Format lecture time
    lecture_location: event.lecture_location, // Display lecture location
    is_holiday: event.is_holiday ? 'Yes' : 'No', // Display if it's a holiday
  }));

  // Calculate the total number of pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Handle page change
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Go to previous page
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1); // Go to next page
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <img src={loading_image} alt={t('loading')} height="40px" width="40px" />
      </div>
    );
  }

  if (error) {
    return (
      <MDTypography color="error">{error}</MDTypography>
    );
  }

  const columns = [
    { Header: t('subject'), accessor: 'subject_name', width: '20%', align: 'left' },
    { Header: t('teacher'), accessor: 'teacher_fullname', width: '25%', align: 'left' },
    { Header: t('date'), accessor: 'lecture_date', width: '15%', align: 'left' },
    { Header: t('time'), accessor: 'lecture_time', width: '15%', align: 'center' },
    { Header: t('location'), accessor: 'lecture_location', width: '15%', align: 'center' },
    { Header: t('holiday'), accessor: 'is_holiday', width: '10%', align: 'center' },
  ];

  return (
    <Card sx={{ borderRadius: '3px' }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {t('upcomingEvents')}
          </MDTypography>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: 'pointer', fontWeight: 'bold' }} fontSize="small" onClick={() => console.log('Menu opened')}>
            more_vert
          </Icon>
        </MDBox>
      </MDBox>
      <MDBox
        height="250px"
        sx={{
          overflow: 'auto',
          borderRadius: '0 0 3px 3px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
          },
        }}
      >
        <DataTable
          table={{
            columns,
            rows: rows.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage),
          }}
          noEndBorder
        />
      </MDBox>
      
      {/* Pagination Controls */}
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
            fontSize: '0.95rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          Next
        </button>
      </div>
    </Card>
  );
}
