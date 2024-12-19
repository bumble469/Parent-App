import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MDBox from 'components/MDBox'; // Adjust path if needed
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'; // Adjust path if needed
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'; // Adjust path if needed
import Footer from 'examples/Footer'; // Adjust path if needed
import axios from 'axios';

function Faculty() {
  const [tabValue, setTabValue] = useState(0);  // State to manage selected tab
  const [staffData, setStaffData] = useState([]);  // Store fetched staff data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // URL based on selected tab
        const apiUrl =
          tabValue === 0
            ? 'http://localhost:8001/api/faculty'  // For Overall filter
            : 'http://localhost:8001/api/chat/chat-list';  // For Current Semester filter

        // Fetch data from the selected API
        const response = await axios.get(apiUrl);
        setStaffData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [tabValue]);  // Effect runs when tabValue changes

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);  // Update the tab value
  };

  const groupedStaff = staffData.reduce((acc, item) => {
    const key = item.teacher_fullname;
    if (!acc[key]) {
      acc[key] = {
        teacher_fullname: item.teacher_fullname,

        teacher_type: item.teacher_type,
        teacher_image: item.teacher_image,
        subjects: [],
        semesters: []
      };
    }
    if (!acc[key].subjects.includes(item.subject_name)) {
      acc[key].subjects.push(item.subject_name);
    }
    if (!acc[key].semesters.includes(item.semester_number)) {
      acc[key].semesters.push(item.semester_number);
    }
    return acc;
  }, {});

  const staffArray = Object.values(groupedStaff);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3}>
        {/* Tabs */}
        <Grid container spacing={3} justifyContent="left">
          <Grid item xs={12} md={6} lg={4}>
            <AppBar position="static">
              <Tabs
                value={tabValue}
                onChange={handleSetTabValue}
                aria-label="faculty tabs"
              >
                <Tab
                  label="Overall"
                  icon={<Icon>group</Icon>}
                />
                <Tab
                  label="Current Sem"
                  icon={<Icon>calendar_today</Icon>}
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>

        {/* Faculty Cards */}
        <MDBox mt={3}>
          <Grid container spacing={3}>
            {staffArray.length > 0 ? (
              staffArray.map((staff, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%", // Allow the card to stretch fully
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: 3,
                    }}
                  >
                    <Box
                      component="img"
                      src={staff.teacher_image || 'path/to/default/image.jpg'}
                      alt={staff.teacher_fullname}
                      sx={{
                        height: "180px", // Fixed height for the image
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6">
                        {staff.teacher_fullname}
                      </Typography>
                      <Typography variant="body2">
                        <b>Type:</b> {staff.teacher_type}
                      </Typography>
                      <Typography variant="body2">
                        <b>Subjects:</b> {staff.subjects.join(', ')}
                      </Typography>
                      <Typography variant="body2">
                        <b>Semesters:</b> {staff.semesters.join(', ')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="text.primary">
                No faculty members available.
              </Typography>
            )}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Faculty;
