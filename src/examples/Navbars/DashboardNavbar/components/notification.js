import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';
import NotificationItem from 'examples/Items/NotificationItem';
import { Icon } from '@mui/material';

const NotificationMenu = ({ open, onClose, notifications }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Notifications</DialogTitle>
      <DialogContent>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={index}>
              <NotificationItem
                icon={<Icon sx={{ color: 'black', fontSize: '2rem' }}>{notification.icon}</Icon>}
                title={notification.title}
              />
              {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))
        ) : (
          <div>No notifications</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

NotificationMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

NotificationMenu.defaultProps = {
  notifications: [],
};

export default NotificationMenu;
