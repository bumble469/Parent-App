import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import axios from 'axios';
import loading_image from '../../assets/images/icons8-loading.gif';
import { useSession } from '../../context/SessionContext';
function Faculty() {
  const {session} = useSession();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const prn = session.studentId || 0;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const apiUrl =
          tabValue === 0
            ? `${REST_API_URL}/api/faculty`
            : `${REST_API_URL}/api/chat/chat-list`;
  
        let response;
  
        if (tabValue === 0) {
          response = await axios.get(apiUrl);
          setStaffData(response.data); 
        } else {
          response = await axios.post(apiUrl, 
            { prn, });
          setStaffData(response.data); 
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [tabValue, prn]);
  
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
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

  if (error) {
    return <Typography variant="h6" color="error">{t('error')}{error}</Typography>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <img src={loading_image} alt={t('loading')} height="40px" width="40px" />
        </Box>
      ) : (
        <MDBox pt={3} pb={3}>
          <Grid container spacing={3} justifyContent="left">
            <Grid item xs={12} md={6} lg={4}>
              <AppBar position="static">
                <Tabs
                  value={tabValue}
                  onChange={handleSetTabValue}
                  aria-label="faculty tabs"
                >
                  <Tab
                    label={t('overall')}
                    icon={<Icon>group</Icon>}
                  />
                  <Tab
                    label={t('currentSem')}
                    icon={<Icon>calendar_today</Icon>}
                  />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>

          <MDBox mt={3}>
            <Grid container spacing={3}>
              {staffArray.length > 0 ? (
                staffArray.map((staff, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 3,
                      }}
                    >
                      <Box
                        component="img"
                        src={staff.teacher_image || 'path/to/default/image.jpg'}
                        alt={staff.teacher_fullname}
                        sx={{
                          height: '180px',
                          objectFit: 'cover',
                          width: '100%',
                        }}
                      />
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6">
                          {staff.teacher_fullname}
                        </Typography>
                        <Typography variant="body2">
                          <b>{t('type')}</b> {staff.teacher_type}
                        </Typography>
                        <Typography variant="body2">
                          <b>{t('subject')}</b> {staff.subjects.join(', ')}
                        </Typography>
                        <Typography variant="body2">
                          <b>{t('semesters')}</b> {staff.semesters.join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" color="text.primary">
                  {t('noFaculty')}
                </Typography>
              )}
            </Grid>
          </MDBox>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Faculty;
