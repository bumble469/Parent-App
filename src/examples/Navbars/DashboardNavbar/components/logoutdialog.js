import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

function LogoutDialog({ open, handleClose, handleConfirm }) {
  const {t,i18n} = useTranslation();
  const isHindi = i18n.language != 'en';
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title" sx={{fontSize:isHindi?'1.4rem':'1.3rem'}}>{t('ConfirmLogout')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description" sx={{fontSize:isHindi?'1.1rem':'1rem'}}>
          {t('LogoutSurety')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" sx={{fontSize:isHindi?'1rem':'0.95rem'}}>
          {t('cancel')}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus sx={{fontSize:isHindi?'1rem':'0.95rem'}}>
          {t('okay')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LogoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default LogoutDialog;
