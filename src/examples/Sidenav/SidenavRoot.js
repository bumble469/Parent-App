// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { miniSidenav } = ownerState;

  const sidebarWidth = 270;
  const { white, black } = palette; // Access white and black from the theme palette
  const { xxl } = boxShadows;
  const { pxToRem } = functions;

  // Set the background color to white
  let backgroundValue = white.main; // This ensures the sidebar has a white background

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    background: backgroundValue,
    color: black.main, // Set text color to black
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: xxl,
      marginBottom: "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    background: backgroundValue,
    color: black.main, // Set text color to black
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: xxl,
      marginBottom: "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",
      background: backgroundValue, // Apply the white background
      color: black.main, // Apply black text color
      borderRadius: "5px", // Add the border-radius to the entire sidebar
      overflowY: "auto", // Ensure the sidebar scrolls vertically if content overflows

      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),

      // Custom scrollbar styling
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "rgba(0, 0, 0, 0.1)", // Light track color
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker thumb color
        borderRadius: "10px", // Rounded scrollbar thumb
      },
    },
  };
});
