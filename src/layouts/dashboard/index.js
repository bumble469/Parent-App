import React from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import Projects from 'layouts/dashboard/components/Projects';
import reportsBarChartData, { calculateOverallAttendance } from 'layouts/dashboard/data/reportsBarChartData';
import reportsLineChartData, { calculateOverallMarks } from 'layouts/dashboard/data/reportsLineChartData';
import { calculateStarRating } from './data/overallrating'; // Import the utility function
import StarIcon from '@mui/icons-material/Star'; // Import star icon
import StarBorderIcon from '@mui/icons-material/StarBorder'; // Import empty star icon
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { analyzeSubjects } from "./data/strongweaksubjects"

function Dashboard() {
  const { marks } = reportsLineChartData;
  const overallMarks = calculateOverallMarks(marks.datasets.data);
  const progressPercentage = Math.min(Math.max(overallMarks, 0), 100);
  const { attended, total } = reportsBarChartData.datasets;

  // Calculate overall attendance percentage using the imported function
  const overallAttendancePercentages = calculateOverallAttendance(attended, total);

  // Calculate the average attendance percentage (optional, if you want a single value)
  const averageAttendance = (
    overallAttendancePercentages.reduce((acc, curr) => acc + parseFloat(curr), 0) /
    overallAttendancePercentages.length
  ).toFixed(2);

  // Get star rating data using the utility function
  const { starRating, fullStars, halfStar, emptyStars, ratingMessage } = calculateStarRating(overallMarks, averageAttendance);

  const { datasets, labels } = marks;

  // Use the utility function to get strong and weak subjects
  const { strongSubjects, weakSubjects } = analyzeSubjects(labels, datasets.data);

  // Filter subjects with attendance below 75%
  const lowAttendanceSubjects = reportsBarChartData.labels
  .map((subject, index) => ({
    name: subject,
    percentage: Math.round(overallAttendancePercentages[index]), // Rounding to the nearest whole number
  }))
  .filter((subject) => subject.percentage < 75);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2} mt={3} mb={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="weekend"
                title="Overall Attendance"
                count={`${averageAttendance}%`}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "than last semester",
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
          <Grid className="Overall-Marks" item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Overall Performance"
                count={`${overallMarks.toFixed(2)}%`}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last semester",
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={progressPercentage}
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
                  color: "success",
                  label: `${ratingMessage}`,
                }}
              >
                <MDBox display="flex" alignItems="center" justifyContent="space-evenly" sx={{ pb: 1.45 }}>
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Subject Wise Attendance"
                  description="Lectures Attended / Lectures Occurred"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3} borderRadius='3px'>
                <ReportsLineChart
                  color="success"
                  title="Marks Graphical"
                  description={
                    <>
                      (<strong>+15%</strong>) increase since last semester
                    </>
                  }
                  date="updated 4 min ago"
                  chart={marks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <ComplexStatisticsCard
                color="success"
                title="Strong Subjects"
                icon="check_circle"
                sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                percentage={{
                  label: "Great work, keep it up!"
                }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  height="100px"
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
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                        width="100%"
                      >
                        <MDTypography variant="button" fontWeight="medium" sx={{ flexGrow: 1 }}>
                          {subject.name}
                        </MDTypography>
                        <MDBox width="60%" mx={2}>
                          <progress
                          value={subject.percentage}
                          max={100}
                          style={{ width: '100%' }}
                        ></progress>
                        </MDBox>
                        <MDTypography variant="button" fontWeight="medium" sx={{ minWidth: '35px' }}>
                          {`${subject.percentage}%`}
                        </MDTypography>
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
            <Grid item xs={12} md={4} lg={4}>
              <ComplexStatisticsCard
                color="error"
                title="Weak Subjects"
                icon="warning"
                sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                percentage={{
                  label: "Needs improvement"
                }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  height="100px"
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
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                        width="100%"
                      >
                        <MDTypography variant="button" fontWeight="medium" sx={{ flexGrow: 1 }}>
                          {subject.name}
                        </MDTypography>
                        <MDBox width="60%" mx={2}>
                          <progress
                            value={subject.percentage}
                            max={100}
                            style={{ width: '100%' }}
                          ></progress>
                        </MDBox>
                        <MDTypography variant="button" fontWeight="medium" sx={{ minWidth: '35px' }}>
                          {`${subject.percentage}%`}
                        </MDTypography>
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
            <Grid item xs={12} md={4} lg={4}>
              <ComplexStatisticsCard
                color="warning"
                icon="error"
                title="Low-Attendance Alerts"
                percentage={{
                  color: "error",
                  label: `Total: ${lowAttendanceSubjects.length}`,
                }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  height="100px"
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
                  {lowAttendanceSubjects.length > 0 ? (
                    lowAttendanceSubjects.map((subject, index) => (
                      <MDBox
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                        width="100%"
                      >
                        <MDTypography variant="button" fontWeight="medium" sx={{ flexGrow: 1 }}>
                          {subject.name}
                        </MDTypography>
                        <MDBox width="60%" mx={2}>
                          <progress
                            value={subject.percentage}
                            max={100}
                            style={{ width: '100%' }}
                          ></progress>
                        </MDBox>
                        <MDTypography variant="button" fontWeight="medium" sx={{ minWidth: '35px' }}>
                          {`${subject.percentage}%`}
                        </MDTypography>
                      </MDBox>
                    ))
                  ) : (
                    <MDTypography variant="h6" color="textSecondary">
                      All subjects have attendance above 75%
                    </MDTypography>
                  )}
                </MDBox>
              </ComplexStatisticsCard>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
