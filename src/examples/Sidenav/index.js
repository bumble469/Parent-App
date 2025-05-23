import { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import SidenavCollapse from 'examples/Sidenav/SidenavCollapse';
import SidenavRoot from 'examples/Sidenav/SidenavRoot';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import './styles/styles.css';
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from 'context';

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace('/', '');
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const [student, setStudent] = useState(null);
  const { t, i18n } = useTranslation(); 
  const [isSpinning, setIsSpinning] = useState(true);
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  useEffect(() => {
    const timer = setTimeout(() => setIsSpinning(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch(`${REST_API_URL}/api/student/profile`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prn }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      }
    };

    fetchStudentProfile();
  }, []); 

  useEffect(() => {
    const handleMiniSidenav = () => {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    };

    window.addEventListener('resize', handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener('resize', handleMiniSidenav);
  }, [dispatch, location]);

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  // Render routes
  const renderRoutes = routes.map(({ type, name, icon, title, key, href, route }) => {
    let returnValue;
    if (type === 'collapse') {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === 'title') {
      returnValue = (
        <MDTypography
          key={key}
          color="grey"
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={2}
          mt={1}
          mb={1}
          ml={1}
          fontSize={i18n.language != 'en' ? '0.97rem' : '0.78rem'}
        >
          {title}
        </MDTypography>
      );
    } else if (type === 'divider') {
      returnValue = (
        <Divider
          key={key}
          light={(!darkMode && !whiteSidenav && !transparentSidenav) || (darkMode && !transparentSidenav && whiteSidenav)}
        />
      );
    }
    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox
        pt={2}
        pb={1}
        px={2}
        textAlign="left"
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <MDBox
          display={{ xs: 'block', xl: 'none' }}
          position="absolute"
          top={0}
          right={0}
          p={1}
          onClick={closeSidenav}
          sx={{ cursor: 'pointer' }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: 'bold' }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox
          component={NavLink}
          to="/"
          display="flex"
          alignItems="center"
          flexDirection="row"
          px={1}
          sx={{ width: "100%", textDecoration: "none" }}
        >
          {brand && (
            <MDBox
              component="img"
              src={brand}
              alt="Brand"
              width="4rem"
              sx={{ mr: 1 }}
              className={isSpinning ? "logo-spin" : ""}
            />
          )}
          <MDBox display="flex" flexDirection="column" alignItems="flex-start" width="auto">
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              sx={{ fontSize: "1.7rem", textAlign: "center" }}
            >
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          sx={{
            borderRadius: '3px',
            textAlign: 'center',
            width: '100%',
            padding: '3px',
          }}
        >
          {student && student.parentInfo ? (
            <MDTypography
              variant="caption"
              color="black"
              fontSize={i18n.language==='hi'?'1rem':'0.93rem'}
              sx={{
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',  
                mb: 1,
              }}
            >
              {t("Welcome")}, {student.parentInfo[0]?.name} / {student.parentInfo[1]?.name}
            </MDTypography>          
          ) : (
            <MDTypography
              variant="caption"
              color="black"
              fontSize={i18n.language==='hi'?'1rem':'0.93rem'}
              sx={{
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 1,
              }}
            >
              {t("Welcome")}, Parents
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
      <List sx={{ marginTop: '13px' }}>{renderRoutes}</List>
      <Divider sx={{ bgcolor: 'gray', my: 0.5 }} />
      <MDBox
        px={1}
        py={1}
        sx={{
          color: '#000000 !important',
          width: '100%',
          textAlign: 'center',
          borderRadius: '3px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '0.875rem',
          cursor: 'default',
          pointerEvents: 'none',
          padding: '5px',
          fontStyle: 'italic',
          marginTop: 'auto',
        }}
      >
        {t('AParentOrientedInitiative')}
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: 'info',
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  brand: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['collapse', 'title', 'divider']).isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      title: PropTypes.string,
      key: PropTypes.string.isRequired,
      href: PropTypes.string,
      route: PropTypes.string,
    })
  ).isRequired,
};

export default Sidenav;
