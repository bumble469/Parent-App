import { useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function PlatformSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleChangePassword = () => {
    // Logic to handle password change
    alert('Change Password clicked');
  };

  const handleChangeEmail = () => {
    // Logic to handle email change
    alert('Change Email clicked');
  };

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <MDBox p={2}>
        <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
          Account Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Notifications
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email Notifications
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox mt={3}>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Account Management
          </MDTypography>
          <MDBox display="flex" flexDirection="column" mt={2}>
            <MDBox mb={1}>
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="primary"
                onClick={handleChangePassword}
              >
                Change Password
              </MDTypography>
            </MDBox>
            <MDBox mb={1}>
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="primary"
                onClick={handleChangeEmail}
              >
                Change Email
              </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <MDBox mt={0.5}>
                <Switch checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
              </MDBox>
              <MDBox width="80%" ml={0.5}>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  Two-Factor Authentication
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
