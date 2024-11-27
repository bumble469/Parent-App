import React, { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DataTable from 'examples/Tables/DataTable';
import achievements from './data/achievementsData';
import CardContent from '@mui/material/CardContent';
import MDBox from 'components/MDBox';
import Typography from '@mui/material/Typography';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import attendanceData from './data/AttendancData';
import marksData from './data/MarksData';
import { Box } from '@mui/material';
import ApexCharts from 'react-apexcharts';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,  // Make sure ArcElement is registered
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

import { Radar, Line, Bar } from 'react-chartjs-2';



function Performance() {
  const [semester, setSemester] = useState('semester1');

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const currentData = attendanceData[semester] || [];
  const currentMarksData = marksData[semester] || [];
  // Calculate average attendance percentage
  const totalClasses = currentData.reduce((acc, data) => acc + data.attendance.length, 0);
  const totalPresent = currentData.reduce(
    (acc, data) => acc + data.attendance.filter((record) => record.status === 'Present').length,
    0,
  );
  const averageAttendance = totalClasses ? (totalPresent / totalClasses) * 100 : 0;

  // Calculate overall average grade
  const grades = currentMarksData.flatMap((data) => [
    data.interim,
    data.sle,
    data.internals,
    data.practicals,
    data.theory,
  ]);
  const totalMarks = grades.length;
  const overallMarks = totalMarks ? grades.reduce((acc, grade) => acc + grade, 0) / totalMarks : 0;

  // Calculate student's rank
  const studentRank = 5; // Replace with your logic to calculate rank

  const uniqueDates = useMemo(() => {
    const allDates = currentData.flatMap((data) => data.attendance.map((record) => record.date));
    return Array.from(new Set(allDates)).sort();
  }, [currentData]);

  const columns = useMemo(
    () => [
      { Header: 'Subject', accessor: 'subject' },
      ...uniqueDates.map((date) => ({ Header: date, accessor: date })),
    ],
    [uniqueDates],
  );

  const tableData = useMemo(
    () =>
      currentData.map((data) => {
        const row = { subject: data.subject };
        uniqueDates.forEach((date) => {
          const record = data.attendance.find((rec) => rec.date === date);
          row[date] = record ? record.status : 'No Lectures';
        });
        return row;
      }),
    [currentData, uniqueDates],
  );

  const marksColumns = useMemo(
    () => [
      { Header: 'Subject', accessor: 'subject' },
      { Header: 'Interim', accessor: 'interim' },
      { Header: 'SLE', accessor: 'sle' },
      { Header: 'Internals', accessor: 'internals' },
      { Header: 'Practicals', accessor: 'practicals' },
      { Header: 'Theory', accessor: 'theory' },
      { Header: 'Total', accessor: 'total' },
    ],
    [],
  );

  const marksTableData = useMemo(() => {
    return currentMarksData.map((data) => ({
      subject: data.subject,
      interim: data.interim,
      sle: data.sle,
      internals: data.internals,
      practicals: data.practicals,
      theory: data.theory,
      total: data.total,
    }));
  }, [currentMarksData]);

  const marksBarChartData = useMemo(
    () => ({
      series: [
        {
          name: 'Total Marks',
          data: currentMarksData.map((data) => data.total),
        },
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: false,
        },
        plotOptions: {
          bar: {
            horizontal: false, // Set to false for vertical bars
          },
        },
        xaxis: {
          categories: currentMarksData.map((data) => data.subject), // Subject names as categories
          title: {
            text: 'Subjects',
          },
        },
        yaxis: {
          title: {
            text: 'Total Marks',
          },
        },
        colors: ['#FF5733'],
        dataLabels: {
          enabled: true,
        },
      },
    }),
    [currentMarksData],
  );

  const averageAttendanceBySubject = useMemo(() => {
    return currentData.map((data) => {
      const totalClasses = data.attendance.length;
      const totalPresent = data.attendance.filter((record) => record.status === 'Present').length;
      const averageAttendance = totalClasses ? (totalPresent / totalClasses) * 100 : 0;
      return {
        subject: data.subject,
        averageAttendance: Math.round(averageAttendance * 100) / 100, // Rounds to 2 decimal places
      };
    });
  }, [currentData]);


  //Bar chart 
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
    [averageAttendanceBySubject],
  );
  
  // Pie Chart Data for Marks Distribution
  const radarChartData = useMemo(() => {
    const subjects = currentMarksData.map((data) => data.subject);
    const datasets = [
      {
        label: 'Interim',
        data: currentMarksData.map((data) => data.interim),
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        pointBackgroundColor: '#FF5733',
      },
      {
        label: 'SLE',
        data: currentMarksData.map((data) => data.sle),
        borderColor: '#33FF57',
        backgroundColor: 'rgba(51, 255, 87, 0.2)',
        pointBackgroundColor: '#33FF57',
      },
      {
        label: 'Internals',
        data: currentMarksData.map((data) => data.internals),
        borderColor: '#3357FF',
        backgroundColor: 'rgba(51, 87, 255, 0.2)',
        pointBackgroundColor: '#3357FF',
      },
      {
        label: 'Practicals',
        data: currentMarksData.map((data) => data.practicals),
        borderColor: '#FF33A1',
        backgroundColor: 'rgba(255, 51, 161, 0.2)',
        pointBackgroundColor: '#FF33A1',
      },
      {
        label: 'Theory',
        data: currentMarksData.map((data) => data.theory),
        borderColor: '#FFCC33',
        backgroundColor: 'rgba(255, 204, 51, 0.2)',
        pointBackgroundColor: '#FFCC33',
      },
    ];

    return {
      labels: subjects,
      datasets,
    };
  }, [currentMarksData]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* Semester Filter */}
          <Grid item xs={12} container spacing={3} justifyContent="flex-end">
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 220,
                  m: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  padding: '8px', // Outer padding around the component
                }}
              >
                <InputLabel
                  id="semester-select-label"
                  sx={{
                    fontSize: '1rem',
                    color: 'text.secondary',
                    padding: '0 8px', // Padding inside the label
                  }}
                >
                  Semester
                </InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={semester}
                  onChange={handleSemesterChange}
                  label="Semester"
                  sx={{
                    '& .MuiSelect-outlined': {
                      padding: '12px 16px', // Padding inside the select box
                      fontSize: '1rem',
                      color: 'text.primary',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.dark',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  <MenuItem value="semester1">Semester 1</MenuItem>
                  <MenuItem value="semester2">Semester 2</MenuItem>
                  <MenuItem value="semester3">Semester 3</MenuItem>
                  <MenuItem value="semester4">Semester 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Statistics Cards in One Row */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <MDBox sx={{ height: '100%' }}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="school"
                    title="Average Attendance"
                    count={`${averageAttendance.toFixed(2)}%`}
                    percentage={{
                      color: averageAttendance < 75 ? 'error' : 'success',
                      amount: averageAttendance < 75 ? '-10%' : '+5%',
                      label: 'than last semester',
                    }}
                  >
                    <MDBox width="100%">
                      <progress
                        value={Math.min(Math.max(averageAttendance, 0), 100)}
                        max={100}
                        style={{ width: '100%' }}
                      ></progress>
                    </MDBox>
                  </ComplexStatisticsCard>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox sx={{ height: '100%' }}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="leaderboard"
                    title="Average Grade"
                    count={`${Math.min(Math.max(overallMarks, 0), 100).toFixed(2)}%`}
                    percentage={{
                      color: 'success',
                      amount: '+3%',
                      label: 'than last semester',
                    }}
                  >
                    <MDBox width="100%">
                      <progress
                        value={Math.min(Math.max(overallMarks, 0), 100)}
                        max={100}
                        style={{ width: '100%' }}
                      ></progress>
                    </MDBox>
                  </ComplexStatisticsCard>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox sx={{ height: '100%' }}>
                  <ComplexStatisticsCard
                    color="warning"
                    icon="star"
                    title="Extra Curricular Activities"
                    percentage={{
                      label: `Rank: #${studentRank}`,
                    }}
                  >
                    <MDBox
                      sx={{
                        maxHeight: '50px', // Set a maximum height for the scrollable area
                        overflowY: 'auto', // Enable vertical scrolling
                        padding: '8px', // Optional: Add padding to ensure content is not flush with the edges
                      }}
                    >
                      <MDTypography variant="body2" color="textSecondary" fontSize="0.9rem">
                        Debate Club, Chess Club, Volunteer Work, Art Workshop, Soccer, Coding Club,
                        Music Band, Drama Society, Student Council, Photography Club
                      </MDTypography>
                    </MDBox>
                  </ComplexStatisticsCard>
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ width: '100%', overflow: 'hidden' }}>
                  <CardContent>
                    <Typography sx={{ mb: 2, color: 'grey', mt: 2 }}>
                      Achievements & Projects
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        overflowX: 'auto', // Enables horizontal scrolling
                        padding: '10px',
                        gap: 2, // Adds space between cards
                      }}
                    >
                      {achievements.map((achievement, index) => (
                        <Box
                          key={index}
                          sx={{
                            minWidth: '200px', // Ensures cards have a minimum width
                            textAlign: 'center',
                            p: 2,
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: '#f9f9f9',
                            overflow: 'hidden',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 1, // Space between title and description
                            }}
                          >
                            {achievement.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal', // Allows for wrapping in description
                            }}
                          >
                            {achievement.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'gray',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mt: 1, // Space between description and date
                            }}
                          >
                            {achievement.date}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          {/* Graphs and Tables */}
          <Grid item xs={12} mt={2}>
            <Grid container spacing={2}>
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
                      Attendance Table
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns: columns, rows: tableData }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid>
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

            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} mt={4} mb={2}>
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
                      Marks Table
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns: marksColumns, rows: marksTableData }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} mt={4} mb={2}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="primary" // Professional color
                  borderRadius="lg"
                  coloredShadow="primary"
                >
                  <MDTypography variant="h6" color="white" fontWeight="medium">
                    Marks Distribution
                  </MDTypography>
                </MDBox>

                <MDBox pt={3} style={{ height: '425px' }}>
                  <Pie
                    data={{
                      labels: radarChartData.labels, // Labels from radar chart (subject names)
                      datasets: [
                        {
                          label: 'Interim',
                          data: radarChartData.datasets.map((dataset) => dataset.data[0]), // Interim data for each subject
                          backgroundColor: 'rgba(255, 87, 51, 0.2)', // Red color for Interim
                          hoverBackgroundColor: 'rgba(255, 87, 51, 0.4)',
                        },
                        {
                          label: 'SLE',
                          data: radarChartData.datasets.map((dataset) => dataset.data[1]), // SLE data for each subject
                          backgroundColor: 'rgba(51, 255, 87, 0.2)', // Green color for SLE
                          hoverBackgroundColor: 'rgba(51, 255, 87, 0.4)',
                        },
                        {
                          label: 'Internals',
                          data: radarChartData.datasets.map((dataset) => dataset.data[2]), // Internals data for each subject
                          backgroundColor: 'rgba(51, 87, 255, 0.2)', // Blue color for Internals
                          hoverBackgroundColor: 'rgba(51, 87, 255, 0.4)',
                        },
                        {
                          label: 'Practicals',
                          data: radarChartData.datasets.map((dataset) => dataset.data[3]), // Practicals data for each subject
                          backgroundColor: 'rgba(255, 51, 161, 0.2)', // Pink color for Practicals
                          hoverBackgroundColor: 'rgba(255, 51, 161, 0.4)',
                        },
                        {
                          label: 'Theory',
                          data: radarChartData.datasets.map((dataset) => dataset.data[4]), // Theory data for each subject
                          backgroundColor: 'rgba(255, 204, 51, 0.2)', // Yellow color for Theory
                          hoverBackgroundColor: 'rgba(255, 204, 51, 0.4)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            font: {
                              size: 12,
                              family: 'Roboto, sans-serif',
                              color: '#fff', // Ensure the text color is white for visibility
                            },
                          },
                        },
                        tooltip: {
                          enabled: true,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
                          titleFont: {
                            size: 14,
                            family: 'Roboto, sans-serif',
                            color: '#fff', // White text for tooltip title
                          },
                          bodyFont: {
                            size: 12,
                            family: 'Roboto, sans-serif',
                            color: '#fff', // White text for tooltip body
                          },
                        },
                      },
                      maintainAspectRatio: true,
                      animation: {
                        duration: 800,
                        easing: 'easeOutQuart',
                      },
                      elements: {
                        arc: {
                          borderWidth: 1, // Set border width for better visibility of segments
                          borderColor: '#fff', // Add white border for segments to separate them
                        },
                      },
                    }}
                  />
                </MDBox>
              </Card>
              </Grid>
            </Grid>
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
                    type="bar"
                    series={marksBarChartData.series}
                    options={marksBarChartData.chartOptions}
                    height={350}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Performance;
