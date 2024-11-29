import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart'; // Import the ReportsBarChart component
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import attendanceData from './data/AttendancData';
import marksData from './data/MarksData';
import achievements from './data/achievementsData';
import { Card } from '@mui/material';
import ApexCharts from 'react-apexcharts'; // Import ApexCharts for chart rendering

// Define the state for the average attendance by subject and other required data
const chartData = () => {
  const [averageAttendanceBySubject, setAverageAttendanceBySubject] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);

  useEffect(() => {
    // Fetch data for attendance, marks, achievements, etc.
    // Example API calls:
    axios.get('/api/attendance')
      .then(response => setAverageAttendanceBySubject(response.data))
      .catch(error => console.error('Error fetching attendance data:', error));

    axios.get('/api/marks')
      .then(response => setMarksData(response.data))
      .catch(error => console.error('Error fetching marks data:', error));

    axios.get('/api/achievements')
      .then(response => setAchievementsData(response.data))
      .catch(error => console.error('Error fetching achievements data:', error));
  }, []);

  // Bar chart data for attendance
  const attendanceBarChartData = useMemo(
    () => ({
      series: [
        {
          name: 'Average Attendance',
          data: averageAttendanceBySubject.map((data) => data.averageAttendance),
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false, // Set to false for vertical bars
          },
        },
        xaxis: {
          categories: averageAttendanceBySubject.map((data) => data.subject),
          title: {
            text: 'Subjects',
          },
        },
        yaxis: {
          title: {
            text: 'Average Attendance (%)',
          },
        },
        colors: ['#33A1FF'],
        dataLabels: {
          enabled: true,
        },
      },
    }),
    [averageAttendanceBySubject]
  );

  // Bar chart data for marks distribution
  const marksBarChartData = useMemo(
    () => ({
      series: [
        {
          name: 'Marks Distribution',
          data: marksData.map((data) => data.marks), // Adjust data according to your marks data
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false, // Set to false for vertical bars
          },
        },
        xaxis: {
          categories: marksData.map((data) => data.subject), // Adjust categories according to your marks data
          title: {
            text: 'Subjects',
          },
        },
        yaxis: {
          title: {
            text: 'Marks (%)',
          },
        },
        colors: ['#FF5733'],
        dataLabels: {
          enabled: true,
        },
      },
    }),
    [marksData]
  );

  return (
    <div>
      {/* Attendance Bar Chart */}
      <Grid item xs={12} md={12} mt={3} mb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Attendance Bar Chart
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <ApexCharts
              options={attendanceBarChartData.chartOptions}
              series={attendanceBarChartData.series}
              type="bar"
              height={350}
            />
          </MDBox>
        </Card>
      </Grid>

      {/* Marks Distribution Bar Chart */}
      <Grid item xs={12} md={12} mt={4} mb={2}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Marks Distribution
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <ApexCharts
              options={marksBarChartData.chartOptions}
              series={marksBarChartData.series}
              type="bar"
              height={350}
            />
          </MDBox>
        </Card>
      </Grid>
    </div>
  );
};

export default chartData;
