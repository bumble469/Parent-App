import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, useTheme, useMediaQuery } from '@mui/material';
import DataTable from 'examples/Tables/DataTable';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import MDBox from 'components/MDBox';
import Cookies from 'js-cookie';
import loading_image from '../../../assets/images/icons8-loading.gif';
import { useTranslation } from 'react-i18next';

export const PredictMarks = () => {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const MACHINE_LEARNING_URL = process.env.REACT_APP_PARENT_MACHINE_LEARNING_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;

  const fetchMarks = async (prn) => {
    try {
      const response = await axios.post(`${MACHINE_LEARNING_URL}/predict-marks`, { prn });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(t('There was an error fetching the marks:'), error);
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
    { Header: t('Semester'), accessor: 'semester' },
    { Header: t('Marks'), accessor: 'marks' },
    { Header: t('Total Marks'), accessor: 'totalMarks' },
    { Header: t('Percentage'), accessor: 'percentage' },
    { Header: t('Grade'), accessor: 'grade' },
  ];

  const previousSemesters = [
    `${t('Semester')} ${marks?.latest_sem - 2}`,
    `${t('Semester')} ${marks?.latest_sem - 1}`,
  ];

  const filteredMarksTableData = [
    {
      id: 1,
      semester: previousSemesters[0],
      marks: marks?.prev_sem2_marks || t('N/A'),
      totalMarks: marks?.prev_sem2_total_obtainable || t('N/A'),
      percentage: marks?.prev_sem2_perc ? `${marks?.prev_sem2_perc.toFixed(2)}%` : t('N/A'),
      grade: marks?.prev_sem2_grade || t('N/A'),
    },
    {
      id: 2,
      semester: previousSemesters[1],
      marks: marks?.prev_sem1_marks || t('N/A'),
      totalMarks: marks?.prev_sem1_total_obtainable || t('N/A'),
      percentage: marks?.prev_sem1_perc ? `${marks?.prev_sem1_perc.toFixed(2)}%` : t('N/A'),
      grade: marks?.prev_sem1_grade || t('N/A'),
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
      categories: [...previousSemesters, t('Predicted')],  
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
      name: t('Percentage Comparison'),
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
          {t('Marks Predictions')}
        </Typography>
      </MDBox>

      <MDBox sx={{ mt: 4 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <img src={loading_image} alt={t('Loading...')} style={{ width: '50px', height: '50px' }}/>
          </div>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {t('Marks Comparison')}
              </Typography>
              <DataTable
                table={{ columns: marksColumns, rows: filteredMarksTableData }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
              <Box sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', color: 'black', mb:-2 }}>
                {t('Predicted Grade')}: {marks?.predicted_grade_range || t('N/A')} ({marks?.predicted_perc?.toFixed(2) || t('N/A')}%)
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {t('Percentage Comparison Line Graph')}
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