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
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from 'context';

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace('/', '');
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/student/profile');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // Ensure hooks are called consistently
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
        >
          {title}
        </MDTypography>
      );
    } else if (type === 'divider') {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }
    return returnValue;
  });

  if (loading) {
    return <div>Loading...</div>;  // Show loading until student data is fetched
  }

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
          pt={1}
          pb={1}
          px={1}
          sx={{ width: '100%', textDecoration: 'none' }}
        >
          {brand && <MDBox component="img" src={brand} alt="Brand" width="3.3rem" sx={{ mr: 2 }} />}
          <MDBox display="flex" flexDirection="column" alignItems="flex-start" width="auto">
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              sx={{ fontSize: '1.7rem', fontFamily: 'timesnewroman', textAlign: 'center' }}
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
          {student && student.motherInfo && student.fatherInfo ? (
            <MDTypography
              variant="caption"
              color="black"
              fontSize="0.9rem"
              sx={{
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 1,
              }}
            >
              Welcome, {student.motherInfo.name} and {student.fatherInfo.name}
            </MDTypography>
          ) : (
            <MDTypography
              variant="caption"
              color="black"
              fontSize="0.9rem"
              sx={{
                display: 'block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 1,
              }}
            >
              Welcome, Parents
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
        A Parent-Oriented Initiative!
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
