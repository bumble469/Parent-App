import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import MDBox from "components/MDBox";
import MDTypography from 'components/MDTypography';
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { Icon } from "@mui/material";
import profileImage from "../../../assets/images/marie.jpg";
import "../../../Global";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(null);
  const handleOpenProfileMenu = (event) => setProfileMenuAnchor(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileMenuAnchor(null);

  const handleRedirectToProfile = () => {
    navigate("/profile"); // Navigate to the /profile route
    handleCloseProfileMenu();
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  const handleOpenNavbar = () => setMiniSidenav(dispatch, !miniSidenav);

  const renderNotificationMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2, minWidth: 250 }}
    >
      <NotificationItem 
        icon={<Icon sx={{ color: 'black', fontSize: '2rem' }}>email</Icon>} 
        title="Check new messages" 
      />
      <NotificationItem 
        icon={<Icon sx={{ color: 'black', fontSize: '2rem' }}>podcasts</Icon>} 
        title="Manage Podcast sessions" 
      />
      <NotificationItem 
        icon={<Icon sx={{ color: 'black', fontSize: '2rem' }}>shopping_cart</Icon>} 
        title="Payment successfully completed" 
      />
    </Menu>
  );
  

  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenuAnchor}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Boolean(profileMenuAnchor)}
      onClose={handleCloseProfileMenu}
      sx={{ mt: 2, minWidth: 220, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} // Styled for better look
    >
      <MenuItem onClick={handleRedirectToProfile} sx={{ fontSize: '1rem', py: 1.25, display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
        <Icon sx={{ fontSize: '1.5rem', marginRight: '0.75rem', color: 'text.secondary' }}>account_circle</Icon>
        Student Profile
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ fontSize: '1rem', py: 1.25, display: 'flex', alignItems: 'center' }}>
        <Icon sx={{ fontSize: '1.5rem', marginRight: '0.75rem', color: 'text.secondary' }}>logout</Icon>
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
      position={absolute ? "absolute" : navbarType}
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
              <MDTypography variant="caption" color="textSecondary" sx={{ fontSize: '0.875rem', fontWeight: 'bold', fontFamily: '"Noto Sans", sans-serif' }}>
                Current Semester: {global.currentSemester}
              </MDTypography>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
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
                <img src={profileImage} alt="Profile" style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%' }} />
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
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
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
  currentSemester: PropTypes.number.isRequired,
};

export default DashboardNavbar;
