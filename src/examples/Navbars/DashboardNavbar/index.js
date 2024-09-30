import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar'; // Add this import
import Typography from '@mui/material/Typography'; // Add this import
import Divider from '@mui/material/Divider'; // Add this import
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Breadcrumbs from 'examples/Breadcrumbs';
import NotificationMenu from './components/notification'; // Ensure this import is correct
import profileImage from '../../../assets/images/bruce-mars.jpg';
import '../../../Global';
import LogoutDialog from './components/logoutdialog';
import { notifications } from './data/notificationdata';
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from 'examples/Navbars/DashboardNavbar/styles';
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from 'context';

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State for Logout Dialog
  const route = useLocation().pathname.split('/').slice(1);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener('scroll', handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener('scroll', handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(null);
  const handleOpenProfileMenu = (event) => setProfileMenuAnchor(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileMenuAnchor(null);

  const handleRedirectToProfile = () => {
    navigate('/profile'); // Navigate to the /profile route
    handleCloseProfileMenu();
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true); // Open the confirm dialog
  };

  const handleOpenNavbar = () => setMiniSidenav(dispatch, !miniSidenav);

  const handleConfirmLogout = () => {
    alert('Logged out'); // Show alert message
    setLogoutDialogOpen(false); // Close the dialog after confirming
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false); // Close the dialog if user cancels
  };

  const renderNotificationMenu = () => (
    <NotificationMenu
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      notifications={notifications} // Use the imported notification data
    />
  );

  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenuAnchor}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={Boolean(profileMenuAnchor)}
      onClose={handleCloseProfileMenu}
      sx={{
        mt: 2,
        minWidth: 220,
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* User Details */}
      <MenuItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <Avatar sx={{ width: 56, height: 56, mb: 1 }} alt="User Name" src={profileImage} />
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          John Doe
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Roll No: 123456
        </Typography>
      </MenuItem>

      <Divider sx={{ my: 1 }} />

      {/* Profile Button */}
      <MenuItem
        onClick={handleRedirectToProfile}
        sx={{ fontSize: '1rem', py: 1.25, display: 'flex', alignItems: 'center' }}
      >
        <Icon sx={{ fontSize: '1.5rem', marginRight: '0.75rem', color: 'text.secondary' }}>
          account_circle
        </Icon>
        Student Profile
      </MenuItem>

      {/* Logout Button */}
      <MenuItem
        onClick={handleLogout}
        sx={{
          fontSize: '1rem',
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          color: 'error.main',
        }}
      >
        <Icon sx={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>logout</Icon>
        Logout
      </MenuItem>
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
    fontSize: '1.5rem', // Make icons larger
  });

  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDTypography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  fontFamily: '"Noto Sans", sans-serif',
                }}
              >
                Current Semester: {global.currentSemester}
              </MDTypography>
            </MDBox>
            <MDBox color={light ? 'white' : 'inherit'}>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Adjust hover color
                  },
                }}
                aria-controls="notification-menu"
                aria-haspopup="true"
                onClick={handleOpenMenu}
              >
                <Badge
                  variant="dot"
                  color="error"
                  sx={{
                    '& .MuiBadge-dot': {
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Icon sx={{ ...iconsStyle }}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderNotificationMenu()}
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Adjust hover color
                  },
                }}
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleOpenProfileMenu}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%' }}
                />
              </IconButton>
              {renderProfileMenu()}
              <IconButton
                size="medium"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleOpenNavbar}
              >
                <Icon sx={iconsStyle} fontSize="inherit">
                  {miniSidenav ? 'menu_open' : 'menu'}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <LogoutDialog
        open={logoutDialogOpen}
        handleClose={handleCancelLogout}
        handleConfirm={handleConfirmLogout}
      />
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  currentSemester: PropTypes.string.isRequired,
};

export default DashboardNavbar;
