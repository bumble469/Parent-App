import React, { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DataTable from "examples/Tables/DataTable";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart/index";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart/index"; // Assuming you have this component

import attendanceData from "./data/AttendancData";
import marksData from "./data/MarksData";

function Performance() {
  const [semester, setSemester] = useState("semester1");

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const currentData = attendanceData[semester] || [];
  const currentMarksData = marksData[semester] || [];

  // Debug: Check marks data
  console.log("Current Marks Data:", currentMarksData);

  // Calculate average attendance percentage
  const totalClasses = currentData.reduce((acc, data) => acc + data.attendance.length, 0);
  const totalPresent = currentData.reduce((acc, data) => acc + data.attendance.filter(record => record.status === "Present").length, 0);
  const averageAttendance = totalClasses ? (totalPresent / totalClasses) * 100 : 0;

  // Calculate overall average grade (assuming grades are available in attendanceData)
  const grades = currentData.flatMap(data => data.attendance.map(record => record.grade || 0));
  const overallMarks = grades.length ? grades.reduce((acc, grade) => acc + grade, 0) / grades.length : 0;

  // Calculate student's rank (example logic, replace with actual calculation)
  const studentRank = 5; // Replace with your logic to calculate rank

  const uniqueDates = useMemo(() => {
    const allDates = currentData.flatMap((data) => data.attendance.map((record) => record.date));
    return Array.from(new Set(allDates)).sort();
  }, [currentData]);

  const columns = useMemo(() => [
    { Header: "Subject", accessor: "subject" },
    ...uniqueDates.map((date) => ({ Header: date, accessor: date })),
  ], [uniqueDates]);

  const tableData = useMemo(() => 
    currentData.map((data) => {
      const row = { subject: data.subject };
      uniqueDates.forEach((date) => {
        const record = data.attendance.find((rec) => rec.date === date);
        row[date] = record ? record.status : "N/A";
      });
      return row;
    })
  , [currentData, uniqueDates]);

  const marksColumns = useMemo(() => [
    { Header: "Subject", accessor: "subject" },
    { Header: "Interim", accessor: "interim" },
    { Header: "SLE", accessor: "sle" },
    { Header: "Internals", accessor: "internals" },
    { Header: "Practicals", accessor: "practicals" },
    { Header: "Theory", accessor: "theory" },
    { Header: "Total", accessor: "total" },
  ], []);

  const marksTableData = useMemo(() => {
    console.log("Marks Table Data Computed:", currentMarksData);
    if (!currentMarksData || currentMarksData.length === 0) {
      return [];
    }

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

  // Prepare line graph data for the line chart
  const lineChartData = useMemo(() => {
    return {
      labels: currentMarksData.map((data) => data.subject), // Labels for X-axis
      datasets: [
        {
          label: "Total Marks",
          data: currentMarksData.map((data) => data.total), // Y-axis values
          borderColor: "#42A5F5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          fill: true,
        },
      ],
    };
  }, [currentMarksData]);

  // Prepare bar graph data for the marks chart
  const barChartData = useMemo(() => {
    return {
      labels: currentMarksData.map((data) => data.subject), // Labels for X-axis
      datasets: [
        {
          label: "Total Marks",
          data: currentMarksData.map((data) => data.total), // Y-axis values
          backgroundColor: "#42A5F5",
        },
      ],
    };
  }, [currentMarksData]);

  // Prepare comparison graph data for multiple semesters
  const semesterComparisonData = useMemo(() => {
    const semesters = ["semester1", "semester2", "semester3", "semester4"];
    return {
      labels: semesters,
      datasets: semesters.map((sem) => {
        const data = marksData[sem] || [];
        return {
          label: `Semester ${sem.slice(-1)}`,
          data: data.map((d) => d.total), // Example, adjust as needed
          backgroundColor: "#42A5F5",
          borderColor: "#1E88E5",
          borderWidth: 1,
        };
      }),
    };
  }, [marksData]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* Semester Filter */}
          <Grid item xs={12} container spacing={3} justifyContent="flex-end">
            <Grid item>
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel id="semester-select-label">Semester</InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={semester}
                  onChange={handleSemesterChange}
                  label="Semester"
                >
                  <MenuItem value="semester1">Semester 1</MenuItem>
                  <MenuItem value="semester2">Semester 2</MenuItem>
                  <MenuItem value="semester3">Semester 3</MenuItem>
                  <MenuItem value="semester4">Semester 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Attendance Percentage Card */}
          <Grid item xs={12} md={6} lg={4} mb={2}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="weekend"
                title="Overall Attendance"
                count={`${averageAttendance.toFixed(2)}%`}
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

          {/* Average Grade Card */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Average Grade"
                count={`${overallMarks.toFixed(2)}%`}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last semester",
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={overallMarks}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>

          {/* Student Rank Card */}
          <Grid item xs={12} md={6} lg={4}>
            <MDBox>
              <ComplexStatisticsCard
                icon="emoji_events"
                title="Class Rank"
                count={`#${studentRank}`}
                percentage={{
                  color: "info",
                  label: "Current Semester Rank",
                }}
              />
            </MDBox>
          </Grid>

          {/* Attendance Table */}
          <Grid item xs={12} mb={2}>
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
              <MDBox pt={3} sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                <DataTable
                  table={{ columns, rows: tableData }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>

          {/* Marks Table */}
          <Grid item xs={12} mb={2}>
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Performance;
