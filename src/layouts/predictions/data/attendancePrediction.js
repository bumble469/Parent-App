import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';
import axios from 'axios';
import Cookies from 'js-cookie';
import loading_image from '../../../assets/images/icons8-loading.gif';
import MDBox from 'components/MDBox';
import ApexCharts from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';

export const PredictAttendance = () => {
  const theme = useTheme();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;

  const CACHE_KEY = `attendance_cache_${prn}`;
  const CACHE_DURATION = 2*60;

  const fetchAttendance = async () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
          setAttendance(parsedData.data);
          setLoading(false);
          return;
        }
      }

      const response = await axios.post('http://localhost:5000/predict-attendance', { prn });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: response.data, timestamp: Date.now() }));
      setAttendance(response.data);
    } catch (error) {
      setError('Failed to fetch attendance data');
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (attendance) {
      const totalItems = attendance.attendance_by_subject.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    }
  }, [attendance]);

  const goToPreviousPage = () => currentPage > 0 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1);

  const predictionColumns = [
    { Header: 'Day', accessor: 'day_name' },
    { Header: 'Predictions (Chance of attending)', accessor: 'average_prediction' },
  ];

  const attendanceChangesColumns = [
    { Header: 'Subject', accessor: 'subject' },
    { Header: 'Current Attendance (%)', accessor: 'attendance_percentage' },
    { Header: 'If attends next session (%)', accessor: 'new_percentage_attend' },
    { Header: 'If misses next session (%)', accessor: 'new_percentage_miss' },
  ];
  
  const attendanceData = attendance
    ? attendance.attendance_by_subject.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((subjectData) => {
        const attendDiff = (subjectData.new_percentage_attend - subjectData.attendance_percentage).toFixed(2);
        const missDiff = (subjectData.new_percentage_miss - subjectData.attendance_percentage).toFixed(2);
  
        return {
          subject: subjectData.subject,
          attendance_percentage: subjectData.attendance_percentage.toFixed(2),
          new_percentage_attend: (
            <>
              {subjectData.new_percentage_attend.toFixed(2)}% 
              <span style={{ color: attendDiff > 0 ? 'green' : 'red', marginLeft: '5px' }}>
                {attendDiff > 0 ? '▲' : '▼'} {Math.abs(attendDiff)}
              </span>
            </>
          ),
          new_percentage_miss: (
            <>
              {subjectData.new_percentage_miss.toFixed(2)}% 
              <span style={{ color: missDiff > 0 ? 'green' : 'red', marginLeft: '5px' }}>
                {missDiff > 0 ? '▲' : '▼'} {Math.abs(missDiff)}
              </span>
            </>
          ),
        };
      })
    : [];  
  
  const dailyPredictionData = attendance
  ? attendance.daily_predictions.map((prediction) => ({
      day_name: prediction.day_name,
      average_prediction: (prediction.average_prediction * 100).toFixed(2)+ '%',
      risk_level: (100 - prediction.average_prediction * 100).toFixed(2),
    }))
  : [];

  const chartOptions = {
    chart: { 
      type: 'bar', 
      width: "100%", 
      toolbar: { show: false } 
    },
    xaxis: { categories: dailyPredictionData.map((prediction) => prediction.day_name) },
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth:'10rem', 
        borderRadius: 2,
        grouped: true,  
      }
    },
    yaxis: {
      min: 0, 
      max: 100,
      labels: { formatter: (val) => `${val}%`, style: { fontSize: isMobile ? '10px' : '12px' } }
    },
    colors: ['#2196F3', '#FF0000'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: { colors: ['#000'], fontSize: isMobile ? '10px' : '12px' },
      background: { enabled: true, borderRadius: 2, padding: 4, opacity: 0.7 },
    },
    tooltip: { shared: true, intersect: false },
  };
  
  const chartSeries = [
    { name: 'Attendance Prediction', data: dailyPredictionData.map((prediction) => prediction.average_prediction) },
    { name: 'Risk Level', data: dailyPredictionData.map((prediction) => prediction.risk_level) },
  ];
   

  return (
    <Card sx={{ p: 1, mt: 5, mb: 3 }}>
      <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
        <Typography variant="h6" sx={{ color: 'white !important' }}>
          Attendance Forecasting and Risk Assessment
        </Typography>
        <Typography variant="caption" sx={{ color: 'white !important' }}>Based on upcoming week</Typography>
      </MDBox>
      <MDBox sx={{ mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: "center", padding: "50px" }}>
              <img src={loading_image} alt="Loading..." style={{ width: '50px', height: '50px' }} />
            </div>
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error">
            Error loading data: {error}
          </Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Daily Attendance Forecasting</Typography>
                <DataTable
                  table={{ columns: predictionColumns, rows: dailyPredictionData }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Forecasting Bar Graph</Typography>
                <ApexCharts
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height={isMobile ? '300px' : '100%'}  
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>Subject-wise Attendance Details</Typography>
            <DataTable
              table={{ columns: attendanceChangesColumns, rows: attendanceData }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
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
                Previous
              </button>
              <span
                style={{
                  fontSize: '1rem',
                  color: '#333',
                }}
              >
                Page {currentPage + 1} of {totalPages}
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
                Next
              </button>
            </div>
          </>
        )}
      </MDBox>
    </Card>
  );
};
