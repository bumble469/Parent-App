import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function Footer() {
  return (
    <MDBox
      position="relative"
      top={8}
      bottom={0}
      left={0}
      right={0}
      width="calc(100% - 0px)"
      display="flex"
      flexDirection={{ xs: 'column', lg: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      borderRadius="3px"
      sx={{ backgroundColor: '#ffffff', zIndex: 1100, margin: 0 }}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize="14px"
        px={1.5}
        textAlign="center"
        width="100%"
      >
        <MDTypography variant="body2" fontWeight="regular">
          &copy; {new Date().getFullYear()}{' '}
        </MDTypography>
        {/* Add margin here to create space */}
        <Link href="https://www.yourcollege.edu" target="_blank">
          <MDTypography variant="button" fontWeight="medium" sx={{ marginLeft: 1 }}>
            Kishinchand Chellaram College
          </MDTypography>
        </Link>
        .   All rights reserved by Group-6 
      </MDBox>

      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        mt={1}
        mb={0}
        p={0}
      >
        <Link href="https://www.linkedin.com/school/yourcollege" target="_blank" sx={{ mx: 2 }}>
          <Icon fontSize="large" sx={{ color: '#0A66C2' }}>
            linkedin
          </Icon>
        </Link>
        
      </MDBox>
    </MDBox>
  );
}

export default Footer;
