import React from 'react';
import Grid from '@mui/material/Grid';

// @mui icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';

// Overview page components
import Header from 'layouts/profile/components/Header';
import PlatformSettings from 'layouts/profile/components/PlatformSettings';
import studentData from './data/studentdata';

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
                  'Student Information': {
                    'Full Name': student.name,
                    'Roll No': student.rollNo,
                    Age: student.age,
                    Email: student.email,
                    'Date of Birth': student.dateOfBirth,
                    'Enrollment Date': student.enrollmentDate,
                    GPA: student.academicPerformance.gpa,
                    Address: `${student.address.street}, ${student.address.city}, ${student.address.state}, ${student.address.zipCode}`,
                    'Contact Home': student.contact.home,
                    'Contact Mobile': student.contact.mobile,
                  },
                  'Mother Information': {
                    Name: student.parents.mother.name,
                    'Contact Mobile': student.parents.mother.contact.mobile,
                    'Contact Work': student.parents.mother.contact.work,
                    Email: student.parents.mother.email,
                    Address: `${student.parents.mother.address.street}, ${student.parents.mother.address.city}, ${student.parents.mother.address.state}, ${student.parents.mother.address.zipCode}`,
                    Occupation: student.parents.mother.occupation,
                    'Work Hours': student.parents.mother.workHours,
                  },
                  'Father Information': {
                    Name: student.parents.father.name,
                    'Contact Mobile': student.parents.father.contact.mobile,
                    'Contact Work': student.parents.father.contact.work,
                    Email: student.parents.father.email,
                    Address: `${student.parents.father.address.street}, ${student.parents.father.address.city}, ${student.parents.father.address.state}, ${student.parents.father.address.zipCode}`,
                    Occupation: student.parents.father.occupation,
                    'Work Hours': student.parents.father.workHours,
                  },
                }}
                social={[
                  {
                    link: 'https://www.facebook.com/CreativeTim/',
                    icon: <FacebookIcon />,
                    color: 'facebook',
                  },
                  {
                    link: 'https://twitter.com/creativetim',
                    icon: <TwitterIcon />,
                    color: 'twitter',
                  },
                  {
                    link: 'https://www.instagram.com/creativetimofficial/',
                    icon: <InstagramIcon />,
                    color: 'instagram',
                  },
                ]}
                action={{ route: '', tooltip: 'Edit Profile' }}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
