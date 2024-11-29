import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';
import NotificationItem from 'examples/Items/NotificationItem';
import { Icon } from '@mui/material';

const NotificationMenu = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/dashboard/student/graph');
        const data = await response.json();

        const lowAttendanceAndMarks = data.map(subject => {
          const attendancePercentage = (subject.lectures_attended / subject.lectures_total) * 100;
          const marksPercentage = (subject.totalMarks / subject.totalPossibleMarks) * 100;

          const notifications = [];

          // Check for low attendance
          if (attendancePercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} has low attendance: ${attendancePercentage.toFixed(2)}%`,
            });
          }

          // Check for low marks
          if (marksPercentage < 75) {
            notifications.push({
              icon: 'warning',
              title: `${subject.sub_name} has low marks: ${marksPercentage.toFixed(2)}%`,
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
        {loading ? (
          <div>Loading notifications...</div>
        ) : notifications.length > 0 ? (
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
};

export default NotificationMenu;
