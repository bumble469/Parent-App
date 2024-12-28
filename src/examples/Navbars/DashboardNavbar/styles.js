function navbar(theme, ownerState) {
  const { palette, boxShadows, functions, transitions, breakpoints, borders } = theme;
  const { transparentNavbar, absolute, light, darkMode } = ownerState;

  const { dark, white, text, transparent, background } = palette;
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;

  return {
    boxShadow: transparentNavbar || absolute ? 'none' : navbarBoxShadow,
    backdropFilter: transparentNavbar || absolute ? 'none' : `saturate(200%) blur(${pxToRem(30)})`,
    backgroundColor: white.main, // Set background color to white

    color: () => {
      let color;

      if (light) {
        color = white.main;
      } else if (transparentNavbar) {
        color = text.main;
      } else {
        color = dark.main;
      }

      return color;
    },
    position: 'sticky',
    minHeight: pxToRem(75),
    display: 'grid',
    alignItems: 'center',
    paddingTop: pxToRem(8),
    paddingBottom: pxToRem(8),
    paddingRight: 0, // Ensure no padding on the right
    paddingLeft: pxToRem(16), // Add padding on the left if needed
    borderRadius: '5px',
    marginTop: '-8px',

    '& > *': {
      transition: transitions.create('all', {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    '& .MuiToolbar-root': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      [breakpoints.up('sm')]: {
        minHeight: 'auto',
        padding: `${pxToRem(4)} ${pxToRem(16)}`,
      },
    },
  };
}

const navbarContainer = ({ breakpoints }) => ({
  flexDirection: 'column',
  alignItems: 'flex-start', // Align items to the start (left)
  justifyContent: 'space-between',
  pt: 0.5,
  pb: 0.5,

  [breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '0',
    paddingBottom: '0',
  },
});

const navbarRow = ({ breakpoints }, { isMini }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',

  [breakpoints.up('md')]: {
    justifyContent: isMini ? 'space-between' : 'stretch',
    width: isMini ? '100%' : 'max-content',
  },

  [breakpoints.up('xl')]: {
    justifyContent: 'stretch !important',
    width: 'max-content !important',
  },
});

const navbarIconButton = ({ typography: { size }, breakpoints }) => ({
  px: 1,

  '& .material-icons, .material-icons-round': {
    fontSize: `${size.xl} !important`,
  },

  '& .MuiTypography-root': {
    display: 'none',

    [breakpoints.up('sm')]: {
      display: 'inline-block',
      lineHeight: 1.2,
      ml: 0.5,
    },
  },
});

const navbarMobileMenu = ({ breakpoints }) => ({
  display: 'flex',
  lineHeight: 0,

  [breakpoints.up('xl')]: {
    display: 'none',
  },
});

export { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu };
