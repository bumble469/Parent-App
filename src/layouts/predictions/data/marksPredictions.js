import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, useTheme, useMediaQuery } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import MDBox from 'components/MDBox';
import Cookies from 'js-cookie';
import loading_image from '../../../assets/images/icons8-loading.gif';

export const PredictMarks = () => {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;

  const fetchMarks = async (prn) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict-marks', { prn });
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the marks:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchMarks(prn);
      setMarks(result);
      setLoading(false);
    };

    fetchData();
  }, []); 

  const marksColumns = [
    { Header: 'Semester', accessor: 'semester' },
    { Header: 'Marks', accessor: 'marks' },
    { Header: 'Total Marks', accessor: 'totalMarks' },
    { Header: 'Percentage', accessor: 'percentage' },
    { Header: 'Grade Range', accessor: 'gradeRange' },
  ];

  const previousSemesters = [
    `Semester ${marks?.latest_sem - 2}`,
    `Semester ${marks?.latest_sem - 1}`,
    `Semester ${marks?.latest_sem} Prediction`,
  ];

  const filteredMarksTableData = [
    {
      id: 1,
      semester: previousSemesters[0],
      marks: marks?.previous_sem_marks2 || 'N/A',
      totalMarks: marks?.total_marks_previous_sem2 || 'N/A',  
      percentage: marks?.previous_sem_marks2
        ? `${((marks?.previous_sem_marks2 || 0) / (marks?.total_marks_previous_sem2 || 1)) * 100}%`
        : 'N/A',
      gradeRange: marks?.previous_sem_grade_range2 || 'N/A',
    },
    {
      id: 2,
      semester: previousSemesters[1],
      marks: marks?.previous_sem_marks1 || 'N/A',
      totalMarks: marks?.total_marks_previous_sem1 || 'N/A',
      percentage: marks?.previous_sem_marks1
        ? `${((marks?.previous_sem_marks1 || 0) / (marks?.total_marks_previous_sem1 || 1)) * 100}%`
        : 'N/A',
      gradeRange: marks?.previous_sem_grade_range1 || 'N/A',
    },
    {
      id: 3,
      semester: previousSemesters[2],
      marks: marks?.predicted_marks || 'N/A',
      totalMarks: marks?.max_marks || 'N/A',  
      percentage: marks?.predicted_marks
        ? `${((marks?.predicted_marks || 0) / (marks?.max_marks || 1)) * 100}%`
        : 'N/A',
      gradeRange: marks?.grade_range || 'N/A',
      // Unique styling for predicted data
      isPrediction: true,
    },
  ];

  const chartOptions = {
    chart: {
      type: 'line',
      height: '100%',
      toolbar: {
        show: false, 
      },
    },
    xaxis: {
      categories: previousSemesters,  
    },
    stroke: {
      curve: 'smooth',
      colors: ['#2196F3', '#FF9800'], // Blue for actual, Orange for predicted
    },
    markers: {
      size: 5,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
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
  };
  
  const chartSeries = [
    {
      name: 'Percentage Comparison',
      data: [
        marks?.previous_sem_marks2 && marks?.total_marks_previous_sem2
          ? ((marks?.previous_sem_marks2 / marks?.total_marks_previous_sem2) * 100).toFixed(2)
          : 0,
        marks?.previous_sem_marks1 && marks?.total_marks_previous_sem1
          ? ((marks?.previous_sem_marks1 / marks?.total_marks_previous_sem1) * 100).toFixed(2)
          : 0,
        marks?.predicted_marks && marks?.max_marks
          ? ((marks?.predicted_marks / marks?.max_marks) * 100).toFixed(2)
          : 0,
      ],
    },
  ];

  return (
    <Card sx={{ p: 1, mt: 5, mb:3 }}>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="success"
        borderRadius="lg"
        coloredShadow="success"
      >
        <Typography variant="h6" sx={{ color: 'white !important' }}>
          Marks Predictions
        </Typography>
      </MDBox>

      <MDBox sx={{ mt: 4 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <img src={loading_image} alt="Loading..." style={{ width: '50px', height: '50px' }}/>
          </div>
        ) : (
          <Grid container spacing={3}>
            {/* Marks Comparison Table */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  Marks Comparison
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <DataTable
                    table={{ columns: marksColumns, rows: filteredMarksTableData }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                    getRowProps={(row) => ({
                      style: row.original.isPrediction ? { backgroundColor: '#FFEB3B' } : {}, // Yellow for prediction row
                    })}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  Percentage Comparison Line Graph
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <ApexCharts
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height={isMobile ? '300px' : '100%'}  
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </MDBox>
    </Card>
  );
};
