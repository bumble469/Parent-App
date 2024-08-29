import React from 'react';
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import studentData from "./data/studentdata";

function Overview() {
  const { student } = studentData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={1} />
      <Header>
        <MDBox mt={5} mb={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={8}>
              <ProfileInfoCard
                title="Profile Information"
                description="Detailed information about the student and parents."
                info={{
                  "Student Information": {
                    "Full Name": student.name,
                    "Roll No": student.rollNo,
                    "Age": student.age,
                    "Email": student.email,
                    "Date of Birth": student.dateOfBirth,
                    "Enrollment Date": student.enrollmentDate,
                    "GPA": student.academicPerformance.gpa,
                    "Address": `${student.address.street}, ${student.address.city}, ${student.address.state}, ${student.address.zipCode}`,
                    "Contact Home": student.contact.home,
                    "Contact Mobile": student.contact.mobile,
                  },
                  "Mother Information": {
                    "Name": student.parents.mother.name,
                    "Contact Mobile": student.parents.mother.contact.mobile,
                    "Contact Work": student.parents.mother.contact.work,
                    "Email": student.parents.mother.email,
                    "Address": `${student.parents.mother.address.street}, ${student.parents.mother.address.city}, ${student.parents.mother.address.state}, ${student.parents.mother.address.zipCode}`,
                    "Occupation": student.parents.mother.occupation,
                    "Work Hours": student.parents.mother.workHours,
                  },
                  "Father Information": {
                    "Name": student.parents.father.name,
                    "Contact Mobile": student.parents.father.contact.mobile,
                    "Contact Work": student.parents.father.contact.work,
                    "Email": student.parents.father.email,
                    "Address": `${student.parents.father.address.street}, ${student.parents.father.address.city}, ${student.parents.father.address.state}, ${student.parents.father.address.zipCode}`,
                    "Occupation": student.parents.father.occupation,
                    "Work Hours": student.parents.father.workHours,
                  }
                }}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
        <Divider sx={{ bgcolor: 'gray', my:0.5,mb:-3 }} />
        <MDBox mt={5} sx={{ width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Achievements & Projects</Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', padding: '10px', whiteSpace: 'nowrap' }}>
            {student.achievements.map((achievement, index) => (
              <Box key={index} sx={{ 
                mr: 2, 
                minWidth: '200px', 
                textAlign: 'center', 
                p: 2, 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                overflow: 'hidden'  // Ensures that overflowing content is hidden
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 1 // Space between title and description
                }}>
                  {achievement.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal' // Allows for wrapping in description
                }}>
                  {achievement.description}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'gray',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mt: 1 // Space between description and date
                }}>
                  {achievement.date}
                </Typography>
              </Box>
            ))}
          </Box>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
