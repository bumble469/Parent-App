import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import facultyData from './data/data'; // Ensure this path is correct

function Faculty() {
    const [tabValue, setTabValue] = useState(0);

    const handleSetTabValue = (event, newValue) => {
        setTabValue(newValue);
    };

    const currentView = tabValue === 0 ? 'Overall' : 'Current Sem';

    const filteredTeachingStaff = facultyData.teachingStaff.filter(staff =>
        currentView === 'Overall' || staff.currentSem
    );
    const filteredNonTeachingStaff = facultyData.nonTeachingStaff.filter(staff =>
        currentView === 'Overall' || staff.currentSem
    );

    const allStaff = [...filteredTeachingStaff, ...filteredNonTeachingStaff];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={3} pb={3} mt={2} mb={2}>
                {/* Tabs */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
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
                        {allStaff.length > 0 ? (
                            allStaff.map((staff, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                                            src={staff.image}
                                            alt={staff.name}
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
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Typography gutterBottom variant="h6" component="div">
                                                {staff.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {staff.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Qualifications: {staff.qualifications}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Type: {staff.type}
                                            </Typography>
                                            {staff.currentSem !== undefined && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {staff.currentSem ? "Currently Teaching" : "Not Teaching This Semester"}
                                                </Typography>
                                            )}
                                            {/* Subjects List */}
                                            {staff.subjects && staff.subjects.length > 0 && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Subjects: {staff.subjects.join(', ')}
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
