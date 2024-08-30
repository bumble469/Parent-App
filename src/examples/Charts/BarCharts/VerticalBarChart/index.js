import React from 'react';
import { Grid } from '@mui/material';
import VerticalBarChart from 'components/Charts/VerticalBarChart/VerticalBarChart';
import { attendanceData } from "../../../../layouts/performance/data/AttendancData";

const calculateAttendancePercentage = (attendance) => {
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(item => item.status === "Present").length;
  return (presentClasses / totalClasses) * 100;
};

const transformAttendanceData = (semesterData) => {
  return semesterData.map(subjectData => ({
    label: subjectData.subject,
    data: [calculateAttendancePercentage(subjectData.attendance)], // Only one data point per subject
    color: getRandomColor(),
  }));
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const semester4Data = transformAttendanceData(attendanceData.semester4);

const attendanceBarChartData = {
  labels: attendanceData.semester4.map(subject => subject.subject),
  datasets: semester4Data,
};

function AttendanceChart() {
  return (
    <Grid item xs={12} md={12} mb={2}>
      <Card>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h6" gutterBottom>
            Attendance Trend for Semester 4
          </MDTypography>
          <VerticalBarChart
            title="Attendance by Subject"
            height="20rem"
            chart={attendanceBarChartData}
          />
        </MDBox>
      </Card>
    </Grid>
  );
}

export default AttendanceChart;
