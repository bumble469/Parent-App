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
      const response = await axios.post('http://localhost:5000/predict-marks', { prn });
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
    { Header: 'Grade', accessor: 'grade' },
  ];

  const previousSemesters = [
    `Semester ${marks?.latest_sem - 2}`,
    `Semester ${marks?.latest_sem - 1}`,
  ];
  
  const filteredMarksTableData = [
    {
      id: 1,
      semester: previousSemesters[0],
      marks: marks?.prevsem2_marks || 'N/A',
      totalMarks: marks?.prevsem2_total_obtainable || 'N/A',
      percentage: marks?.prevsem2_perc ? `${marks?.prevsem2_perc.toFixed(2)}%` : 'N/A',
      grade: marks?.prevsem2_grade || 'N/A',
    },
    {
      id: 2,
      semester: previousSemesters[1],
      marks: marks?.prevsem1_marks || 'N/A',
      totalMarks: marks?.prevsem1_total_obtainable || 'N/A',
      percentage: marks?.prevsem1_perc ? `${marks?.prevsem1_perc.toFixed(2)}%` : 'N/A',
      grade: marks?.prevsem1_grade || 'N/A',
    }
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
      categories: [...previousSemesters, 'Predicted'],  
    },
    stroke: {
      curve: 'smooth',
      colors: ['#2196F3', '#FF9800'], 
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
        marks?.prevsem2_perc ? marks?.prevsem2_perc.toFixed(2) : 0,
        marks?.prevsem1_perc ? marks?.prevsem1_perc.toFixed(2) : 0,
        marks?.predicted_perc ? marks?.predicted_perc.toFixed(2) : 0,
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
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Marks Comparison
              </Typography>
              <DataTable
                table={{ columns: marksColumns, rows: filteredMarksTableData }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
              <Box sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', color: 'black', mb:-2 }}>
                Predicted Grade: {marks?.predicted_grade_range || 'N/A'} ({marks?.predicted_perc?.toFixed(2) || 'N/A'}%)
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Percentage Comparison Line Graph
              </Typography>
              <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={isMobile ? '300px' : '100%'}  
              />
            </Grid>
          </Grid>
        )}
      </MDBox>
    </Card>
  );
};
