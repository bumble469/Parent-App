import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Sample data for student reports
const studentReports = [
  {
    name: "John Doe",
    id: "12345",
    totalAttendance: "95%",
    totalMarks: "88%",
    subjects: [
      { name: "Mathematics", internal: "Midterm: 85%, Final: 90%", external: "Entrance Exam: 80%" },
      { name: "Science", internal: "Midterm: 90%, Final: 92%", external: "Entrance Exam: 85%" },
      { name: "History", internal: "Midterm: 80%, Final: 88%", external: "Entrance Exam: 78%" }
    ],
    passFail: "Pass"
  },
  
  // Add more student data as needed
];

function Reporting() {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      // Handle feedback submission (e.g., send to an API)
      console.log("Feedback submitted:", feedback);
      setFeedback('');
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3}>
        <Grid container spacing={3}>
          {/* Reporting Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: 3,
                p: 3,
                mb: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Student Report - Current Semester
              </Typography>
              <Grid container spacing={2}>
                {studentReports.map((report, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Box
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        p: 2,
                        mb: 2,
                        backgroundColor: '#f9f9f9',
                        boxShadow: 2,
                      }}
                    >
                      <Typography variant="h6">{report.name} (ID: {report.id})</Typography>
                      <Typography variant="body1"><strong>Total Attendance:</strong> {report.totalAttendance}</Typography>
                      <Typography variant="body1"><strong>Total Marks:</strong> {report.totalMarks}</Typography>
                      {report.subjects.map((subject, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Typography variant="body1"><strong>Subject:</strong> {subject.name}</Typography>
                          <Typography variant="body2"><strong>Internal Exams:</strong> {subject.internal}</Typography>
                          <Typography variant="body2"><strong>External Exams:</strong> {subject.external}</Typography>
                        </Box>
                      ))}
                      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                        <strong>Status:</strong> {report.passFail}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Feedback Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: 3,
                p: 3,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Parent Feedback
              </Typography>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Your Feedback"
                  value={feedback}
                  onChange={handleFeedbackChange}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitFeedback}
                >
                  Submit Feedback
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reporting;   