import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';
import backgroundImage from 'assets/images/campus.jpg';
import { Divider } from '@mui/material';
import bruceMars from '../../../../assets/images/bruce-mars.jpg';
import Cookies from 'js-cookie';
import axios from 'axios';
function Header({ children }) {
  const [student, setStudent] = useState(null);
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await axios.post(`${REST_API_URL}/api/student/profile`, {
          prn:prn
        });
  
        const data = await response.data;
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };
  
    fetchStudentProfile();
  }, [prn]); 
    
  if (!student) {
    return <div>Loading...</div>; 
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="15rem"
        borderRadius="xl"
        marginTop="20px"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6),
            )}, url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%',
          overflow: 'hidden',
        }}
      />
      <Card
        sx={{
          position: 'relative',
          mt: -6, // Adjusted to align the card with the header properly
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
          <MDAvatar
            src={student.studentInfo.studentImage || bruceMars} // Use the Base64 image or fallback to default
            alt="profile-image"
            size="xl"
            shadow="sm"
          />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={1} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {student.studentInfo.fullName} {/* Displaying student's full name */}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: 'gray', mb: -3.5 }} />
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: '',
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
