import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MDBox from 'components/MDBox';
import axios from 'axios';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import Header from 'layouts/profile/components/Header';
import PlatformSettings from 'layouts/profile/components/PlatformSettings';
import { useTranslation } from 'react-i18next';
import loading_image from '../../assets/images/icons8-loading.gif';
import { Box } from '@mui/material';
import Cookies from 'js-cookie';
function Overview() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  useEffect(() => {
    const fetchStudentProfile = async (prn) => {
      try {
        const response = await axios.post(`${REST_API_URL}/api/student/profile`, {
          prn: prn
        });
        const data = response.data;
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile(prn);
  }, [prn]);

  if (loading) {
    return(
      <Box sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: 2
      }}>
        <img src={loading_image} alt="Loading" style={{ width: '40px', height: '40px' }} />
      </Box>
    );
  }
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
                  title={t('profileInfoTitle')}
                  description={t('profileInfoDescription')}
                  info={{
                    [t('studentInfo')]: {
                      [t('fullName')]: student.studentInfo.fullName,
                      [t('rollNo')]: student.studentInfo.rollNo,
                      [t('age')]: student.studentInfo.age,
                      [t('email')]: student.studentInfo.email,
                      [t('dob')]: student.studentInfo.dob,
                      [t('enrollmentDate')]: student.studentInfo.enrollmentDate,
                      [t('address')]: student.studentInfo.address,
                      [t('contactMobile')]: student.studentInfo.contactMobile,
                    },
                    [t('parentInfo')]: student.parentInfo && student.parentInfo.length > 0
                      ? {
                          [t('fatherName')]: student.parentInfo[0]?.name || t('na'),
                          [t('fatherEmail')]: student.parentInfo[0]?.email || t('na'),
                          [t('fatherMobile')]: student.parentInfo[0]?.contactMobile || t('na'),
                          [t('motherName')]: student.parentInfo[1]?.name || t('na'),
                          [t('motherEmail')]: student.parentInfo[1]?.email || t('na'),
                          [t('motherMobile')]: student.parentInfo[1]?.contactMobile || t('na'),
                        }
                      : { [t('parentDetails')]: t('na') },
                    [t('courseFeesInfo')]: {
                      [t('totalFees')]: student.studentInfo.totalFees || t('na'),
                      [t('feesPaid')]: student.studentInfo.feesPaid || t('na'),
                      [t('feesPending')]: student.studentInfo.feesPending || t('na'),
                      [t('transactionStatus')]: student.studentInfo.transactionInfo?.transactionStatus || t('na'),
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
                  action={{ route: '', tooltip: t('editProfile') }}
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
