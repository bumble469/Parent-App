import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MDBox from 'components/MDBox'; // Adjust the path if needed
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'; // Adjust the path if needed
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'; // Adjust the path if needed
import Footer from 'examples/Footer'; // Adjust the path if needed
import axios from 'axios'; // Import axios for making API requests

function Faculty() {
  const [tabValue, setTabValue] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/faculty'); 
        console.log('API Response:', response.data); 

        if (Array.isArray(response.data)) {
          setStaffData(response.data);
        } else {
          throw new Error('Unexpected API response structure');
        }

        setLoading(false);
      } catch (error) {
        console.error('API Error:', error); // Log the error for debugging
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  // Group staff data by teacher_id
  const groupedStaff = staffData.reduce((acc, item) => {
    if (!acc[item.teacher_id]) {
      acc[item.teacher_id] = {
        ...item,
        subjects: [],
        semesters: []
      };
    }
    if (item.subject_name && !acc[item.teacher_id].subjects.includes(item.subject_name)) {
      acc[item.teacher_id].subjects.push(item.subject_name);
    }
    if (item.semester_name && !acc[item.teacher_id].semesters.includes(item.semester_name)) {
      acc[item.teacher_id].semesters.push(item.semester_name);
    }
    return acc;
  }, {});

  const staffArray = Object.values(groupedStaff);

  // Filter staffArray based on the selected tab and current semester
  const currentSemester = 'Semester 4'; // Set the current semester

  const filteredStaff = tabValue === 1
    ? staffArray.filter(staff => staff.semesters.includes(currentSemester))
    : staffArray;

  if (loading) {
    return <Typography variant="h6" color="text.primary">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error: {error.message}</Typography>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3} mt={2} mb={2}>
        {/* Tabs */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
            <AppBar position="static">
              <Tabs
                orientation="horizontal"
                value={tabValue}
                onChange={handleSetTabValue}
                aria-label="faculty view tabs"
              >
                <Tab
                  label="Overall"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      group
                    </Icon>
                  }
                />
                <Tab
                  label="Current Sem"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      calendar_today
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>

        {/* Staff Boxes */}
        <MDBox mt={3}>
          <Grid container spacing={3} justifyContent="center">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={staff.teacher_id}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      width: '100%',
                      maxWidth: 345,
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: 3,
                      margin: 'auto', // Center card horizontally
                    }}
                  >
                    <Box
                      component="img"
                      src={staff.teacher_image || 'path/to/default/image.jpg'} // Handle missing images
                      alt={`${staff.firstname} ${staff.lastname}`}
                      sx={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        p: 2,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography gutterBottom variant="h6" component="div">
                        {`${staff.firstname} ${staff.lastname}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Type:</b> {staff.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Qualification:</b> {staff.qualification}
                      </Typography>
                      {staff.subjects.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          <b>Subjects:</b> {staff.subjects.join(', ')}
                        </Typography>
                      )}
                      {staff.semesters.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          <b>Semesters:</b> {staff.semesters.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.primary">
                  No staff members available for the selected view.
                </Typography>
              </Grid>
            )}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Faculty;
