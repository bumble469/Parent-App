import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';
import axios from 'axios';
import Cookies from 'js-cookie';
import loading_image from '../../../assets/images/icons8-loading.gif';
import MDBox from 'components/MDBox';
import ApexCharts from 'react-apexcharts';

export const PredictAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;

  const fetchAttendance = async (prn) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-attendance', { prn });
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchAttendance(prn);
      setAttendance(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (attendance) {
      const totalItems = attendance.attendance_by_subject.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    }
  }, [attendance]);

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

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

  const attendanceData = attendance ? attendance.attendance_by_subject.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((subjectData) => ({
    subject: subjectData.subject,
    attendance_percentage: subjectData.attendance_percentage.toFixed(2),
    new_percentage_attend: subjectData.new_percentage_attend.toFixed(2),
    new_percentage_miss: subjectData.new_percentage_miss.toFixed(2),
  })) : [];

  const dailyPredictionData = attendance ? attendance.daily_predictions.map((prediction) => ({
    day_name: prediction.day_name,
    average_prediction: (prediction.average_prediction * 100).toFixed(2),
  })) : [];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: { show: false },
    },
    xaxis: {
      categories: dailyPredictionData.map((prediction) => prediction.day_name),
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '10%',
        borderRadius: 5,
      },
    },
    colors: ['#2196F3'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val}%`;
      },
      style: {
        colors: ['#000'],
        fontSize: '12px',
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 3,
        padding: 4,
        opacity: 0.7,
        color: '#2196F3',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const chartSeries = [
    {
      name: 'Attendance Prediction',
      data: dailyPredictionData.map((prediction) => prediction.average_prediction),
    },
  ];

  return (
    <Card sx={{ p: 1, mt: 5, mb: 3 }}>
      <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
        <Typography variant="h6" sx={{ color: 'white !important' }}>
          Attendance Predictions
        </Typography>
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
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Daily Attendance Predictions</Typography>
                <DataTable
                  table={{ columns: predictionColumns, rows: dailyPredictionData }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>Prediction Bar Graph</Typography>
                <ApexCharts
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height="100%"
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
