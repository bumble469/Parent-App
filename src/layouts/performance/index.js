import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Card, CardContent, Typography } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import MDTypography from 'components/MDTypography';
import { fetchAchievements } from "./data/achievements";
import AttendanceTable from './data/detailed_attendance';
import ReportsBarChartWrapper from './data/attendanceBar1';
import MarksTable from './data/detailed_marks';
import LineGraph from './data/marksGraphs';
import Footer from 'examples/Footer';
import OverallAttendance from './data/overallAttendance';
function Performance() {
  const [semester, setSemester] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [averageMarks, setAverageMarks] = useState(0);
  const [achievements, setAchievements] = useState([]);

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/performance/student');
        const data = await response.json();
        // Extract unique semesters
        const uniqueSemesters = Array.from(new Set(data.map(item => item.semester_id)))
          .map(id => ({
            id,
            name: `Semester ${id}`,
          }));
        setSemesters(uniqueSemesters);
        if (uniqueSemesters.length > 0) {
          setSemester(uniqueSemesters[0].id); // Default semester
        }
        setMarksData(data); // Save the marks data as well for later processing

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate average marks
    const filteredMarks = marksData.filter(item => item.semester_id === semester);

    // Group by subject to sum marks for each subject
    const marksBySubject = filteredMarks.reduce((acc, item) => {
      const subjectId = item.subject_id;
      if (!acc[subjectId]) {
        acc[subjectId] = { totalMarks: 0, obtainedMarks: 0 };
      }
      acc[subjectId].totalMarks += item.max_marks;
      acc[subjectId].obtainedMarks += item.marks_obtained;
      return acc;
    }, {});

    // Calculate the total obtained marks and total possible marks for all subjects
    let totalObtainedMarks = 0;
    let totalPossibleMarks = 0;

    Object.values(marksBySubject).forEach(subject => {
      totalObtainedMarks += subject.obtainedMarks;
      totalPossibleMarks += subject.totalMarks;
    });

    // Calculate the average marks
    if (totalPossibleMarks > 0) {
      const avgMarks = (totalObtainedMarks / totalPossibleMarks) * 100;
      setAverageMarks(avgMarks);
    } else {
      setAverageMarks(0); // Set to 0 if no marks data
    }

  }, [semester, marksData]);

  useEffect(() => {
    const loadAchievements = async () => {
      if (semester) {
        const data = await fetchAchievements(semester);
        setAchievements(data);
      }
    };
    loadAchievements();
  }, [semester]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} container spacing={3} justifyContent="flex-start">
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 250,
                  m: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  padding: '8px',
                }}
              >
                <InputLabel
                  id="semester-select-label"
                  sx={{
                    fontSize: '1rem',
                    color: 'text.secondary',
                    padding: '0 8px',
                  }}
                >
                  SEMESTER
                </InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={semester}
                  onChange={handleSemesterChange}
                  label="Semester"
                  sx={{
                    '& .MuiSelect-outlined': {
                      padding: '12px 16px',
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
                  {semesters.length > 0 ? (
                    semesters.map((sem) => (
                      <MenuItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No semesters available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <OverallAttendance semester={semester}/>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox sx={{ height: '100%' }}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="leaderboard"
                    title="Average Grade"
                    count={`${averageMarks.toFixed(2)}%`}
                    percentage={{
                      color: 'success',
                      amount: '+3%',
                      label: 'than last semester',
                    }}
                  >
                    <MDBox width="100%">
                      <progress
                        value={Math.min(Math.max(averageMarks, 0), 100)}
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
                      label: `Rank: 5`,
                    }}
                  >
                    <MDBox
                      sx={{
                        maxHeight: '50px', // Set a maximum height for the scrollable area
                        overflowY: 'auto', // Enable vertical scrolling
                        padding: '8px', // Optional: Add padding to ensure content is not flush with the edges
                        '::-webkit-scrollbar': {
                            width: '8px', // Width of the scrollbar
                        },
                        '::-webkit-scrollbar-thumb': {
                          backgroundColor: '#888', // Color of the scrollbar thumb
                          borderRadius: '4px',
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                          backgroundColor: '#555', // Color on hover
                        },
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
                            {achievement.ach_title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal', // Allows for wrapping in description
                            }}
                          >
                            {achievement.ach_detail}
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
                            {achievement.ach_date}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={1}>
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
                      Subject-Wise Detailed Attendance
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                  <AttendanceTable semester={semester} />
                  </MDBox>
                </Card>
              </Grid> 
              <Grid item xs={12} md={12} mt={1} mb={3}>
                  <ReportsBarChartWrapper semester={semester}/>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} mt={3} mb={2}>
                <MarksTable semester={semester}/>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} mt={4} mb={2}>
                <LineGraph semester={semester}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer/>
    </DashboardLayout>
  );
}

export default Performance;
