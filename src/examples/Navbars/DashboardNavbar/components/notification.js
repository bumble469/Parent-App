import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Box,
} from '@mui/material';
import NotificationItem from 'examples/Items/NotificationItem';
import { Icon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotificationMenu = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/dashboard/student/graph');
        const data = await response.json();

        const lowAttendanceAndMarks = data.map((subject) => {
          const attendancePercentage =
            (subject.lectures_attended / subject.lectures_total) * 100;
          const marksPercentage =
            (subject.totalMarks / subject.totalPossibleMarks) * 100;

          const notifications = [];

          // Check for low attendance
          if (attendancePercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} has low attendance: ${attendancePercentage.toFixed(
                2
              )}%`,
            });
          }

          // Check for low marks
          if (marksPercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} has low marks: ${marksPercentage.toFixed(
                2
              )}%`,
            });
          }

          return notifications;
        });

        // Flatten the array of notifications
        setNotifications(lowAttendanceAndMarks.flat());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to remove a notification by its index
  const removeNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Notifications
        </DialogTitle>
        <IconButton
          onClick={onClose}
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
          maxHeight: '400px', // Set a maximum height for the scrollable area
          overflowY: 'auto', // Enable vertical scrolling
          '&::-webkit-scrollbar': {
            width: '8px', // Width of the scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Color of the scrollbar thumb
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Color on hover
          },
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>Loading notifications...</Box>
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
          <Box sx={{ textAlign: 'center', py: 2 }}>No notifications</Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

NotificationMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationMenu;
