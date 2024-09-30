import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function Footer() {
  return (
    <MDBox
      position="relative" // Fixes the footer to the bottom
      top={8}
      bottom={0} // Aligns the footer to the bottom of the page
      left={0} // Ensures the footer starts from the left edge
      right={0} // Ensures the footer extends to the right edge
      width="calc(100% - 0px)" // Adjust if needed to account for any potential sidebar width
      display="flex"
      flexDirection={{ xs: 'column', lg: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      borderRadius="3px"
      sx={{ backgroundColor: '#ffffff', zIndex: 1100, margin: 0 }} // Light background color for the footer
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize="14px" // Adjusted font size
        px={1.5}
        textAlign="center"
      >
        &copy; {new Date().getFullYear()}{' '}
        <Link href="https://www.yourcollege.edu" target="_blank">
          <MDTypography variant="button" fontWeight="medium">
            Your College Name
          </MDTypography>
        </Link>
        . All rights reserved.
      </MDBox>
      <MDBox display="flex" alignItems="center" justifyContent="center" mt={1} mb={0} p={0}>
        <Link href="https://www.instagram.com/yourcollege" target="_blank" sx={{ mx: 2 }}>
          <Icon fontSize="large" sx={{ color: '#E1306C' }}>
            instagram
          </Icon>
        </Link>
        <Link href="https://www.linkedin.com/school/yourcollege" target="_blank" sx={{ mx: 2 }}>
          <Icon fontSize="large" sx={{ color: '#0A66C2' }}>
            linkedin
          </Icon>
        </Link>
        <Link href="https://www.facebook.com/yourcollege" target="_blank" sx={{ mx: 2 }}>
          <Icon fontSize="large" sx={{ color: '#1877F2' }}>
            facebook
          </Icon>
        </Link>
      </MDBox>
    </MDBox>
  );
}

export default Footer;
