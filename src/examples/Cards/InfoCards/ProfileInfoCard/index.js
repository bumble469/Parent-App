import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, description, info, social, action, shadow }) {
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Helper function to render rows of information
  const renderRows = (info) => {
    return Object.entries(info).map(([category, details], idx) => (
      <Grid item xs={12} key={idx}>
        <MDBox mb={1}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {category}
          </MDTypography>
          <MDBox mt={0.5}>
            <Grid container spacing={1}>
              {Object.entries(details).map(([label, value], idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <MDBox display="flex" py={0.5}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" sx={{ flex: '1' }}>
                      {label}:
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="regular" color="text" sx={{ flex: '2' }}>
                      {value}
                    </MDTypography>
                  </MDBox>
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </MDBox>
      </Grid>
    ));
  };

  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={0.5}
      pl={0.25}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        <MDBox mb={0.5} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          <Grid container spacing={0.5}>
            {renderRows(info)}
          </Grid>
          <MDBox display="flex" py={0.5} pr={1}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
              Social: &nbsp;
            </MDTypography>
            {renderSocial}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.object).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
