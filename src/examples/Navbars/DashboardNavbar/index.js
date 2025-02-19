import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import NotificationItem from 'examples/Items/NotificationItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Breadcrumbs from 'examples/Breadcrumbs';
import profileImage from '../../../assets/images/bruce-mars.jpg';
import LogoutDialog from './components/logoutdialog';
import { useTranslation } from 'react-i18next';
import loading_image from '../../../assets/images/icons8-loading.gif';
import Cookies from 'js-cookie';
import GuidModal from '../../../components/Guide/index';
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
  const [notifications, setNotifications] = useState([]);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const [openDialog, setOpenDialog] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const route = useLocation().pathname.split('/').slice(1);
  const navigate = useNavigate();
  const { i18n ,t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage); 
  };
  const isHindi = i18n.language != 'en';
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  
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

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleOpenProfileMenu = (event) => setProfileMenuAnchor(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileMenuAnchor(null);

  const handleRedirectToProfile = () => {
    navigate('/profile');
    handleCloseProfileMenu();
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    sessionStorage.clear();
    Cookies.remove('student_id');
    alert('Logged out');
    setLogoutDialogOpen(false);
    navigate('/login');
  }

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };


  const handleOpenNavbar = () => setMiniSidenav(dispatch, !miniSidenav);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasLowAttendance = t('hasLowAttendance');
  const hasLowMarks = t('hasLowMarks');
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8001/api/student/currentsemester", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prn }),
        });
        const studentData = await response.json();
        setStudent(studentData);
  
        const notificationResponse = await fetch("http://localhost:8001/api/dashboard/student/graph",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prn }),
        });
        const notificationData = await notificationResponse.json();
  
        const lowAttendanceAndMarks = notificationData.map((subject) => {
          const attendancePercentage = (subject.lectures_attended / subject.lectures_total) * 100;
          const marksPercentage = (subject.totalMarks / subject.totalPossibleMarks) * 100;
  
          const notifications = [];
          if (attendancePercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} ${hasLowAttendance} ${attendancePercentage.toFixed(2)}%`,
            });
          }
          if (marksPercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} ${hasLowMarks} ${marksPercentage.toFixed(2)}%`,
            });
          }
          return notifications;
        });
        setNotifications(lowAttendanceAndMarks.flat()); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, [i18n.language]); 
  if(loading){
    return <div className='d-flex justify-content-center'>
      <img src={loading_image} alt={t('loading')} height="40px" width="40px"></img>
    </div>
  } 

  const iconsStyle = {
    fontSize: '2rem',
    color: 'inherit',
  };

  const removeNotification = (index) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications.splice(index, 1);
      return updatedNotifications;
    });
  };
  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          <MDBox pr={1} mt={2}>
              <MDTypography
                color="textSecondary"
                sx={{
                  fontWeight: 'bold',
                  fontSize:'1.2rem'
                }}
              >
                <FormControl sx={{padding:1}}>
                  <InputLabel sx={{fontSize:isHindi?'1.25rem !important':'1.15rem'}}>{t('language')}</InputLabel>
                  <Select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    label="Language"
                    sx={{fontSize:'1rem', width:'5rem', marginTop:'0.25rem'}}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिंदी</MenuItem>
                    <MenuItem value="mr">मराठी</MenuItem>
                    <MenuItem value="ur">اردو</MenuItem>
                    <MenuItem value="gj"> ગુજરાતી</MenuItem>
                  </Select>
                </FormControl>
              </MDTypography>
            </MDBox>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDTypography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontSize: isHindi ? '1rem':'0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {t('currentSem')}: {student.formattedProfile.current_Sem}
              </MDTypography>
            </MDBox>
            <IconButton>
              <GuidModal isOpen={isModalOpen} onClose={toggleModal} />
              <Icon onClick={toggleModal} sx={{ fontSize: '1.5rem', color: '#000000', mt: 0.5}}>
                help_outline
              </Icon>
            </IconButton>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={handleOpenDialog}
              >
                <Badge
                  variant="dot"
                  color="error"
                  invisible={notifications.length === 0}
                >
                  <Icon>notifications</Icon>
                </Badge>
              </IconButton>
              

              {/* Profile Menu */}
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleOpenProfileMenu}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%' }}
                />
              </IconButton>
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
                <MenuItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, mb: 1 }} alt="User Name" src={profileImage} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {student.formattedProfile.stud_fullname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t("rollno")}: {student.formattedProfile.stud_rollno}
                  </Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleRedirectToProfile}>
                  <Icon sx={{ fontSize: '1.4rem !important', marginRight: '0.75rem', color: 'text.secondary' }}>
                    account_circle
                  </Icon>
                  <Typography sx={{fontSize:isHindi?'1.1rem':'1rem'}}>{t('studentProfile')}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Icon sx={{ fontSize: '1.4rem !important', marginRight: '0.75rem' }}>logout</Icon>
                  <Typography sx={{fontSize:isHindi?'1.1rem':'1rem'}}>{t('logout')}</Typography>
                </MenuItem>
              </Menu>

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
        )}
      </Toolbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <DialogTitle
            sx={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {t('notifications')}
          </DialogTitle>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>{t('loadingNotifications')}</Box>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <NotificationItem
                    icon={
                      <Icon sx={{ color: 'rgb(249, 158, 0)', fontSize: '2rem' }}>
                        {notification.icon}
                      </Icon>
                    }
                    title={notification.title}
                  />
                  <IconButton
                    onClick={() => removeNotification(index)}
                    sx={{ color: 'red' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>{t('noNotifications')}</Box>
          )}
        </DialogContent>
      </Dialog>
      <LogoutDialog
        open={logoutDialogOpen}
        handleConfirm={handleConfirmLogout}
        handleClose={handleCancelLogout}
      />
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
