import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import studentData from "layouts/profile/data/studentdata";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, parentName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const {student} = studentData;

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const renderRoutes = routes.map(({ type, name, icon, title, key, href, route }) => {
    let returnValue;
    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
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
    } else if (type === "divider") {
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
          backgroundColor: "#ffffff", // White background
          borderBottom: "1px solid #e0e0e0", // Light gray border
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Align items to the left
        }}
      >
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
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
          sx={{ width: "100%", textDecoration: "none" }}
        >
          {brand && (
            <MDBox
              component="img"
              src={brand}
              alt="Brand"
              width="3.3rem"
              sx={{ mr: 2 }}
            />
          )}
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            width="auto"
          >
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              sx={{ fontSize: "1.7rem", fontFamily: 'timesnewroman', textAlign: "center"}}
            >
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          sx={{
            borderRadius: "3px",
            textAlign: "center",
            width: "100%",
            padding: "3px"
          }}
        >
          <MDTypography
          variant="caption"
          color="black"
          fontSize="0.9rem"
          sx={{
            display: 'block',
            maxWidth: '100%', // Ensures the text fits within the container
            overflow: 'hidden', // Hides any text that overflows the container
            textOverflow: 'ellipsis', // Adds ellipsis for overflow text
            whiteSpace: 'nowrap', // Prevents text from wrapping to a new line
            mb: 1 // Optional: adds margin at the bottom
          }}
        >
          Welcome, {student.parents.mother.name} and {student.parents.father.name}
        </MDTypography>
        </MDBox>
      </MDBox>
      <List sx={{marginTop:"13px"}}>{renderRoutes}</List>
      <Divider sx={{ bgcolor: 'gray', my:0.5 }} />
      <MDBox
        px={1}
        py={1}
        sx={{
          color: "#000000 !important",
          width: "100%",
          textAlign: "center",
          borderRadius: "3px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "0.875rem",
          cursor: "default",
          pointerEvents: "none",
          padding:'5px',
          fontStyle:'italic',
          marginTop: 'auto'
        }}
      >
        A Parent-Oriented Initiative!
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  brand: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["collapse", "title", "divider"]).isRequired,
      name: PropTypes.node.isRequired,
      icon: PropTypes.node,
      route: PropTypes.string,
      href: PropTypes.string,
      key: PropTypes.string.isRequired,
      noCollapse: PropTypes.bool,
    })
  ).isRequired,
};

export default Sidenav;
