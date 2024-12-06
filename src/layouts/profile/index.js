import React, { useEffect, useState } from 'react';
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

function Overview() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/student/profile');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, add a spinner or loading indicator
  }

  // Debugging: Log the student object to check the structure
  console.log(student);

  // Ensure student and parentInfo are correctly populated before rendering
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
              {student && (
                <ProfileInfoCard
                  title="Profile Information"
                  description="Detailed information about the student and parents."
                  info={{
                    'Student Information': {
                      'Full Name': student.studentInfo.fullName,
                      'Roll No': student.studentInfo.rollNo,
                      Age: student.studentInfo.age,
                      Email: student.studentInfo.email,
                      'Date of Birth': student.studentInfo.dob,
                      'Enrollment Date': student.studentInfo.enrollmentDate,
                      Address: student.studentInfo.address,
                      'Contact Mobile': student.studentInfo.contactMobile,
                    },
                    'Parent Information': student.parentInfo && student.parentInfo.length > 0 ? {
                      'Father Name': student.parentInfo[0]?.name || 'N/A',
                      'Father Email': student.parentInfo[0]?.email || 'N/A',
                      'Father Mobile': student.parentInfo[0]?.contactMobile || 'N/A',
                      'Mother Name': student.parentInfo[1]?.name || 'N/A',
                      'Mother Email': student.parentInfo[1]?.email || 'N/A',
                      'Mother Mobile': student.parentInfo[1]?.contactMobile || 'N/A',
                    } : { 'Parent Details': 'N/A' }, // Safely handle empty or undefined parentInfo
                    'Course & Fees Information': {
                      'Total Fees': student.studentInfo.totalFees || 'N/A',
                      'Fees Paid': student.studentInfo.feesPaid || 'N/A',
                      'Fees Pending': student.studentInfo.feesPending || 'N/A',
                      'Transaction Status': student.studentInfo.transactionInfo?.transactionStatus || 'N/A',
                    }
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
              )}
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
