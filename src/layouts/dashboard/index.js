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
import { calculateStarRating } from './data/overallrating'; // Import the utility function
import StarIcon from '@mui/icons-material/Star'; // Import star icon
import StarBorderIcon from '@mui/icons-material/StarBorder'; // Import empty star icon
import StarHalfIcon from '@mui/icons-material/StarHalf';
import SubjectDashboard from './data/strongweaksubjects';
import axios from 'axios';

function Dashboard() {
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [studentData, setStudentData] = useState(null); // State for the fetched student data


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/student/star');
        console.log('API Response:', response.data); // Log to check the data
        setStudentData(response.data); // Set the fetched data
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

  // Calculate total marks and total attendance from the data
  const marksData = studentData?.map((item) => item.marks_obtained);
  const totalMarksData = studentData?.map((item) => item.marks_total);
  const attendanceData = studentData?.map((item) => item.lectures_attended);
  const totalAttendanceData = studentData?.map((item) => item.lectures_total);

  // Calculate total marks and total attendance
  const totalMarks = marksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleMarks = totalMarksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalAttendance = attendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleAttendance = totalAttendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;

  // Calculate the overall percentage for marks and attendance
  const overallMarksPercentage = (totalMarks / totalPossibleMarks) * 100;
  const overallAttendancePercentage = (totalAttendance / totalPossibleAttendance) * 100;

  const overallMarksFromAPI = overallMarksPercentage;
  const averageAttendanceFromAPI = overallAttendancePercentage;

  // Get star rating data using the utility function
  const { starRating, fullStars, halfStar, emptyStars, ratingMessage } = calculateStarRating(
    overallMarksFromAPI,
    averageAttendanceFromAPI,
  );

  // Use the utility function to get strong and weak subjects
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
  }else if(overallMarksFromAPI < 75){
    labelMessageForOverallMarks.message = "Can do better..";
    labelMessageForOverallMarks.color = "warning";
  } else {
    labelMessageForOverallMarks.message = "Good, Keep It Up!";
    labelMessageForOverallMarks.color = "success";
  }

  if (overallAttendancePercentage < 50) {
    labelMessageForOverallAttendance.message = "Needs Improvement!";
    labelMessageForOverallAttendance.color = "error";
  }else if(overallAttendancePercentage < 75){
    labelMessageForOverallAttendance.message = "Can do better..";
    labelMessageForOverallAttendance.color = "warning";
  } else {
    labelMessageForOverallAttendance.message = "Good, Keep It Up!";
    labelMessageForOverallAttendance.color = "success";
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2} mt={3} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="weekend"
                title="Overall Attendance"
                count={`${averageAttendanceFromAPI.toFixed(2)}%`}
                percentage={{
                  color: labelMessageForOverallAttendance.color,
                  amount: labelMessageForOverallAttendance.message
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={Math.min(Math.max(averageAttendanceFromAPI, 0), 100)}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
          <Grid className="Overall-Marks" item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Overall Performance"
                count={`${overallMarksFromAPI.toFixed(2)}%`}
                percentage={{
                  color: labelMessageForOverallMarks.color,
                  amount: labelMessageForOverallMarks.message
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={overallMarksFromAPI}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                color="warning"
                icon="star"
                title="Rating"
                count={`${starRating}/5`}
                percentage={{
                  color: 'success',
                  label: `${ratingMessage}`,
                }}
              >
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-evenly"
                  sx={{ pb: 1.45 }}
                >
                  {[...Array(fullStars)].map((_, index) => (
                    <StarIcon key={`full-${index}`} color="warning" />
                  ))}
                  {halfStar === 1 && <StarHalfIcon key="half" color="warning" />}
                  {[...Array(emptyStars)].map((_, index) => (
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
                <ReportsLineChartWrapper/>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <SubjectDashboard/>
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
