import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Projects from 'layouts/dashboard/events/index';
import ReportsBarChartWrapper from './data/reportsBarChart';
import ReportsLineChartWrapper from './data/reportsLineChartData';
import { calculateStarRating } from './data/overallrating'; 
import StarIcon from '@mui/icons-material/Star'; 
import StarBorderIcon from '@mui/icons-material/StarBorder'; 
import StarHalfIcon from '@mui/icons-material/StarHalf';
import SubjectDashboard from './data/strongweaksubjects';
import axios from 'axios';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/dashboard/student/star');
        setStudentData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If still loading, show loading indicator
  if (loading) return <div>Loading...</div>;
  
  // If an error occurred, show error message
  if (error) return <div>Error: {error.message}</div>;

  // If no data is received, show a message
  if (!studentData || studentData.length === 0) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={2} mt={3} mb={2}>
          <div>No data available to display.</div>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Default values in case of missing data
  const marksData = studentData?.map((item) => item.marks_obtained) || [];
  const totalMarksData = studentData?.map((item) => item.max_marks) || [];
  const attendanceData = studentData?.map((item) => item.total_lectures_attended) || [];
  const totalAttendanceData = studentData?.map((item) => item.total_lectures_conducted) || [];

  const totalMarks = marksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleMarks = totalMarksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalAttendance = attendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleAttendance = totalAttendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;

  const overallMarksPercentage = totalMarks && totalPossibleMarks ? (totalMarks / totalPossibleMarks) * 100 : 0;
  const overallAttendancePercentage = totalAttendance && totalPossibleAttendance ? (totalAttendance / totalPossibleAttendance) * 100 : 0;

  const overallMarksFromAPI = overallMarksPercentage;
  const averageAttendanceFromAPI = overallAttendancePercentage;

  const { starRating, fullStars, halfStar, emptyStars, ratingMessage } = calculateStarRating(
    overallMarksFromAPI,
    averageAttendanceFromAPI
  );

  let labelMessageForOverallMarks = {
    message: '',
    color: ''
  };
  let labelMessageForOverallAttendance = {
    message: '',
    color: ''
  };

  if (overallMarksFromAPI < 50) {
    labelMessageForOverallMarks.message = "Needs Improvement!";
    labelMessageForOverallMarks.color = "error";
  } else if (overallMarksFromAPI < 75) {
    labelMessageForOverallMarks.message = "Can do better..";
    labelMessageForOverallMarks.color = "warning";
  } else if (overallMarksFromAPI >= 75 && overallMarksFromAPI <= 100){
    labelMessageForOverallMarks.message = "Good, Keep It Up!";
    labelMessageForOverallMarks.color = "success";
  } else{
    labelMessageForOverallMarks.message = "No marks records detected..";
    labelMessageForOverallMarks.color = "info";
  }

  if (overallAttendancePercentage < 50) {
    labelMessageForOverallAttendance.message = "Needs Improvement!";
    labelMessageForOverallAttendance.color = "error";
  } else if (overallAttendancePercentage < 75) {
    labelMessageForOverallAttendance.message = "Can do better..";
    labelMessageForOverallAttendance.color = "warning";
  } else if (overallAttendancePercentage >= 75 && overallAttendancePercentage <= 100){
    labelMessageForOverallAttendance.message = "Good, Keep It Up!";
    labelMessageForOverallAttendance.color = "success";
  }
  else {
    labelMessageForOverallAttendance.message = "No attendance records detected..";
    labelMessageForOverallAttendance.color = "info";
  }

  return(
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2} mt={3} mb={2}>
        <Grid container spacing={1}>
          {/* Overall Attendance */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="weekend"
                title="Overall Attendance"
                count={averageAttendanceFromAPI ? `${averageAttendanceFromAPI.toFixed(2)}%` : "N/A"}
                percentage={{
                  color: labelMessageForOverallAttendance.color,
                  amount: labelMessageForOverallAttendance.message || "No data available"
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={averageAttendanceFromAPI ? Math.min(Math.max(averageAttendanceFromAPI, 0), 100) : 0}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
  
          {/* Overall Performance */}
          <Grid className="Overall-Marks" item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Overall Performance"
                count={overallMarksFromAPI ? `${overallMarksFromAPI.toFixed(2)}%` : "N/A"}
                percentage={{
                  color: labelMessageForOverallMarks.color,
                  amount: labelMessageForOverallMarks.message || "No data available"
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={overallMarksFromAPI || 0}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
  
          {/* Rating */}
          <Grid item xs={12} md={12} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                color="warning"
                icon="star"
                title="Rating"
                count={starRating ? `${starRating}/5` : "N/A"}
                percentage={{
                  color: 'success',
                  label: ratingMessage || "No data available"
                }}
              >
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-evenly"
                  sx={{ pb: 1.45 }}
                >
                  {[...Array(fullStars || 0)].map((_, index) => (
                    <StarIcon key={`full-${index}`} color="warning" />
                  ))}
                  {halfStar === 1 && <StarHalfIcon key="half" color="warning" />}
                  {[...Array(emptyStars || 5)].map((_, index) => (
                    <StarBorderIcon key={`empty-${index}`} color="action" />
                  ))}
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
        </Grid>
  
        <MDBox mt={5}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChartWrapper />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3} borderRadius="3px">
                <ReportsLineChartWrapper />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
  
        {/* Subject Dashboard */}
        <SubjectDashboard />
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );  
}

export default Dashboard;
