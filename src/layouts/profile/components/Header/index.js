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

function Header({ children }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Fetch student data (you can replace this with your API call)
    // Example:
    fetch('http://localhost:8001/api/student/profile') // Change to your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setStudent(data); // Assuming the response structure contains student data
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  // Check if student data is available
  if (!student) {
    return <div>Loading...</div>; // Loading state while waiting for data
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="15rem" // Adjusted to make header shorter
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
