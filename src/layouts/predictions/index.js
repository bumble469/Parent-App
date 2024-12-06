import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';

// Initialize ChartJS
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Sample marks data
import marksData from '../performance/data/MarksData';

function Predictions() {
  // Extract and process data to determine strong and weak subjects
  const allMarks = Object.values(marksData).flat();

  const averageMarks = (subject) => {
    const total =
      subject.interim + subject.sle + subject.internals + subject.practicals + subject.theory;
    return (total / 500) * 100; // Assuming total marks are out of 500
  };

  // Only include subjects with an average percentage greater than 85%
  const strongSubjects = allMarks
    .map((subject) => ({
      name: subject.subject,
      percentage: averageMarks(subject),
    }))
    .filter((subject) => subject.percentage > 85) // Updated threshold for strong subjects
    .sort((a, b) => b.percentage - a.percentage);

  const weakSubjects = allMarks
    .map((subject) => ({
      name: subject.subject,
      percentage: averageMarks(subject),
    }))
    .filter((subject) => subject.percentage < 60) // Threshold for weak subjects
    .sort((a, b) => a.percentage - b.percentage);

  // Data for Performance and Predicted Performance Chart
  const attendancePredictionData = {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Actual Attendance',
        data: [75, 80, 85, 88, 92, 85, 87, 90, 95, 90],
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        borderWidth: 2,
        borderDash: [],
      },
      {
        label: 'Predicted Attendance',
        data: [80, 85, 88, 90, 92, 94, 96, 97, 98, 99],
        borderColor: '#FF7043',
        backgroundColor: '#FF7043',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  // Data for Predicted Performance Chart
  const performancePredictionData = {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Actual Performance',
        data: [70, 75, 78, 80, 82, 85, 87, 88, 90, 92],
        borderColor: '#66BB6A',
        backgroundColor: '#66BB6A',
        borderWidth: 2,
        borderDash: [],
      },
      {
        label: 'Predicted Performance',
        data: [75, 80, 85, 88, 90, 92, 93, 95, 96, 98],
        borderColor: '#FFA726',
        backgroundColor: '#FFA726',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3}>
          {/* Cards Row */}
          <Grid container item xs={12} spacing={3}>
            {/* Strong Subjects Card */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <ComplexStatisticsCard
                  color="success"
                  title="Strong Subjects"
                  icon="check_circle"
                  sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                  percentage={{
                    label: 'Great work, keep it up!',
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
                          <MDTypography
                            variant="button"
                            fontWeight="medium"
                            sx={{ minWidth: '35px' }}
                          >
                            {`${subject.percentage.toFixed(2)}%`}
                          </MDTypography>
                        </MDBox>
                      ))
                    ) : (
                      <MDTypography variant="h6" color="textSecondary">
                        No strong subjects above 85%
                      </MDTypography>
                    )}
                  </MDBox>
                </ComplexStatisticsCard>
              </MDBox>
            </Grid>

            {/* Weak Subjects Card */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <ComplexStatisticsCard
                  color="error"
                  title="Weak Subjects"
                  icon="warning"
                  sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                  percentage={{
                    label: 'Needs improvement',
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
                          <MDTypography
                            variant="button"
                            fontWeight="medium"
                            sx={{ minWidth: '35px' }}
                          >
                            {`${subject.percentage.toFixed(2)}%`}
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
              </MDBox>
            </Grid>

            {/* Improvement Recommendations Card */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <ComplexStatisticsCard
                  color="warning"
                  icon="trending_up"
                  title="Improvement Recommendations"
                  sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                  percentage={{
                    label: 'N/A',
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
                    <MDTypography variant="body2" color="textSecondary">
                      <ul>
                        <li>Focus on improving science grades.</li>
                        <li>Additional tutoring recommended for history.</li>
                        <li>Increase study time and practice tests.</li>
                      </ul>
                    </MDTypography>
                  </MDBox>
                </ComplexStatisticsCard>
              </MDBox>
            </Grid>

            {/* Recommended Career Pathways Card */}
            <Grid item xs={12} md={3}>
              <MDBox>
                <ComplexStatisticsCard
                  color="info"
                  icon="school"
                  title="Recommended Career Pathways"
                  sx={{ borderRadius: '12px', boxShadow: 3, p: 2 }}
                  percentage={{
                    label: 'N/A',
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
                    <MDTypography variant="body2" color="textSecondary">
                      <ul>
                        <li>Consider enrolling in advanced science courses.</li>
                        <li>Explore extracurricular activities related to history.</li>
                        <li>Use online resources for additional practice.</li>
                      </ul>
                    </MDTypography>
                  </MDBox>
                </ComplexStatisticsCard>
              </MDBox>
            </Grid>
          </Grid>

          {/* Performance Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '12px', boxShadow: 3, p: 2, height: '400px' }}>
              <MDTypography variant="h6" fontWeight="medium" textAlign="center" gutterBottom>
                Predicted Attendance
              </MDTypography>
              <MDBox sx={{ height: '100%', p: 2 }}>
                <Line data={attendancePredictionData} options={options} />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '12px', boxShadow: 3, p: 2, height: '400px' }}>
              <MDTypography variant="h6" fontWeight="medium" textAlign="center" gutterBottom>
                Predicted Performance
              </MDTypography>
              <MDBox sx={{ height: '100%', p: 2 }}>
                <Line data={performancePredictionData} options={options} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Predictions;
