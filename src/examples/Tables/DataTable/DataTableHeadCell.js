/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import PropTypes from 'prop-types';

import Icon from '@mui/material/Icon';

import MDBox from 'components/MDBox';

import { useMaterialUIController } from 'context';
import { useTranslation } from 'react-i18next';
function DataTableHeadCell({ width, children, sorted, align, ...rest }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const {i18n} = useTranslation();

  const isHindi = i18n.language === 'hi';
  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={3}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        {...rest}
        position="relative"
        textAlign={align}
        color={darkMode ? 'white' : 'secondary'}
        sx={({ typography: { size, fontWeightBold } }) => ({
          fontSize: isHindi?'0.9rem':'0.8rem',
          fontWeight: fontWeightBold,
          textTransform: 'uppercase',
          cursor: sorted && 'pointer',
          userSelect: sorted && 'none',
        })}
      >
        {children}
        {sorted && (
          <MDBox
            position="absolute"
            top={0}
            right={align !== 'right' ? '16px' : 0}
            left={align === 'right' ? '-5px' : 'unset'}
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            <MDBox
              position="absolute"
              top={-6}
              color={sorted === 'asce' ? 'text' : 'secondary'}
              opacity={sorted === 'asce' ? 1 : 0.5}
            >
              <Icon>arrow_drop_up</Icon>
            </MDBox>
            <MDBox
              position="absolute"
              top={0}
              color={sorted === 'desc' ? 'text' : 'secondary'}
              opacity={sorted === 'desc' ? 1 : 0.5}
            >
              <Icon>arrow_drop_down</Icon>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: 'auto',
  sorted: 'none',
  align: 'left',
};

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, 'none', 'asce', 'desc']),
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default DataTableHeadCell;
