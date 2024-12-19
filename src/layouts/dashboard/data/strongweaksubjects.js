import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import Grid from '@mui/material/Grid';
import MDTypography from 'components/MDTypography';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import axios from 'axios';

const SubjectDashboard = () => {
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [lowAttendanceAlerts, setLowAttendanceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/dashboard/student/graph');
        
        // Extract data from API response
        const subjects = response.data.map(item => item.sub_name);
        const attendedLectures = response.data.map(item => item.lectures_attended);
        const totalLectures = response.data.map(item => item.lectures_total);
        const totalMarks = response.data.map(item => item.totalMarks);
        const totalPossibleMarks = response.data.map(item => item.totalPossibleMarks);

        // Calculate percentages
        const marksPercentage = totalMarks.map((marks, index) => (marks / totalPossibleMarks[index]) * 100);
        const attendancePercentage = attendedLectures.map((attended, index) => (attended / totalLectures[index]) * 100);

        // Categorize subjects
        const strongSubjects = subjects
          .map((name, index) => ({ name, percentage: marksPercentage[index] }))
          .filter(subject => subject.percentage > 80);

        const weakSubjects = subjects
          .map((name, index) => ({ name, percentage: marksPercentage[index] }))
          .filter(subject => subject.percentage < 75);

        const lowAttendanceAlerts = subjects
          .map((name, index) => ({ name, percentage: attendancePercentage[index] }))
          .filter(subject => subject.percentage < 75);

        // Set state
        setStrongSubjects(strongSubjects);
        setWeakSubjects(weakSubjects);
        setLowAttendanceAlerts(lowAttendanceAlerts);
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <MDBox mt={1}>
      <Grid container spacing={3}>
        {/* Strong Subjects */}
        <Grid item xs={12} md={4} lg={4}>
          <ComplexStatisticsCard
            color="success"
            title={`Strong Subjects (${strongSubjects.length})`}
            icon="check_circle"
            sx={{ borderRadius: '12px', boxShadow: 3 }}
            percentage={{ label: 'Great work, keep it up!' }}
          >
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              height="80px"
              overflow="auto"
              pt={1}
              pb={1}
              px={1}
              sx={{
                '::-webkit-scrollbar': {
                  width: '8px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              {strongSubjects.length > 0 ? (
                strongSubjects.map((subject, index) => (
                  <MDBox
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    mb={2}
                    width="100%"
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      {subject.name} &nbsp;&nbsp;
                      {Number(subject.percentage).toFixed(2)}%
                    </MDTypography>
                    <MDBox width="100%">
                      <progress
                        value={subject.percentage}
                        max={100}
                        style={{ width: '100%' }}
                      ></progress>
                    </MDBox>
                  </MDBox>
                ))
              ) : (
                <MDTypography variant="h6" color="textSecondary">
                  No strong subjects
                </MDTypography>
              )}
            </MDBox>
          </ComplexStatisticsCard>
        </Grid>

        {/* Weak Subjects */}
        <Grid item xs={12} md={4} lg={4}>
          <ComplexStatisticsCard
            color="error"
            title={`Weak Subjects (${weakSubjects.length})`}
            icon="warning"
            sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
            percentage={{ label: 'Needs Improvement' }}
          >
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              height="80px"
              overflow="auto"
              pt={1}
              pb={1}
              px={1}
              sx={{
                '::-webkit-scrollbar': {
                  width: '8px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              {weakSubjects.length > 0 ? (
                weakSubjects.map((subject, index) => (
                  <MDBox
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    mb={2}
                    width="100%"
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      {subject.name} &nbsp;&nbsp;
                      {Number(subject.percentage).toFixed(2)}%
                    </MDTypography>
                    <MDBox width="100%">
                      <progress
                        value={subject.percentage}
                        max={100}
                        style={{ width: '100%' }}
                      ></progress>
                    </MDBox>
                  </MDBox>
                ))
              ) : (
                <MDTypography variant="h6" color="textSecondary">
                  No weak subjects
                </MDTypography>
              )}
            </MDBox>
          </ComplexStatisticsCard>
        </Grid>

        {/* Low Attendance Alerts */}
        <Grid item xs={12} md={4} lg={4}>
          <ComplexStatisticsCard
            color="warning"
            title={`Low Attendance Subjects (${lowAttendanceAlerts.length})`}
            icon="access_time"
            sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
            percentage={{ label: 'Below 75%' }}
          >
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              height="80px"
              overflow="auto"
              pt={1}
              sx={{
                '::-webkit-scrollbar': {
                  width: '8px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              {lowAttendanceAlerts.length > 0 ? (
                lowAttendanceAlerts.map((subject, index) => (
                  <MDBox
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    mb={2}
                    width="100%"
                  >
                    <MDTypography variant="button" fontWeight="medium" sx={{ color: 'red' }}>
                      {subject.name} &nbsp;&nbsp;
                      {Number(subject.percentage).toFixed(2)}%
                    </MDTypography>
                  </MDBox>
                ))
              ) : (
                <MDTypography variant="body2">No low attendance subjects.</MDTypography>
              )}
            </MDBox>
          </ComplexStatisticsCard>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default SubjectDashboard;
