// collapseItem.js
function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, whiteSidenav, sidenavColor } = ownerState;

  const { transparent, grey, gradients } = palette;
  const { md } = boxShadows;
  const { pxToRem, rgba, linearGradient } = functions;

  return {
    background: active ? 'linear-gradient(90deg, #3D97EE, #257EEA)' : transparent.main,
    color: active ? 'white !important' : 'black',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: `${pxToRem(8)} ${pxToRem(10)}`,
    margin: `${pxToRem(1.5)} ${pxToRem(10)}`,
    borderRadius: '3px',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    [breakpoints.up('xl')]: {
      transition: transitions.create(['box-shadow', 'background-color', 'transform'], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },

    '&:hover, &:focus': {
      backgroundColor: active
        ? linearGradient(gradients[sidenavColor].state, gradients[sidenavColor].main)
        : 'rgba(0, 0, 0, 0.05)', // Light grey background on hover
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, borders, functions } = theme;
  const { active } = ownerState;

  const { white, dark } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color: 'white', // Icon color is white when active, otherwise dark
    borderRadius: borderRadius.md,
    display: 'grid',
    placeItems: 'center',
    transition: transitions.create(['margin', 'transform'], {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    '&:hover svg, &:hover svg g': {
      color: 'white', // Ensure icon color is white when active
      transform: 'scale(1.1)',
    },
  };
}

const collapseIcon = ({ palette: { white, gradients } }, { active }) => ({
  color: 'white',
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightRegular, fontWeightLight } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),

    [breakpoints.up('xl')]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : '100%',
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(['opacity', 'margin', 'color'], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    '& span': {
      fontWeight: active ? fontWeightRegular : fontWeightLight,
      fontSize: size.sm,
      lineHeight: 0,
      color: active ? 'white' : 'black', // Text color is white when active, otherwise black
      '&:hover': {
        color: 'black',
      },
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
