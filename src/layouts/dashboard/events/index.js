/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import React, { useEffect, useState } from 'react'; // Import React and hooks
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading state
import Icon from '@mui/material/Icon'; // Import Icon component
import axios from 'axios'; // Import axios for API calls
import DataTable from 'examples/Tables/DataTable';

export default function Data() {
  const [events, setEvents] = useState([]); // State to store events
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/events/events'); // Adjust the URL based on your API
        // Check if the response is an array and set state
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          throw new Error('Invalid data format'); // Throw error for unexpected data structure
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        const message = err.response
          ? `Error: ${err.response.status} - ${err.response.statusText}`
          : 'Network error. Please try again later.';
        setError(message); // Set error state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEvents();
  }, []); // Runs once when the component mounts

  // Prepare rows for the DataTable
  // Prepare rows for the DataTable
    const rows = (events || []).map((event) => ({
        event: event.event_name, // Display event name
        date: new Date(event.event_date).toLocaleDateString(), // Format date
        time: event.event_time.split('T')[1].split('.')[0], // Format time
        venue: event.venue, // Display venue
    }));

  // Show loading or error messages if applicable
  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </MDBox>
    );
  }
  
  if (error) {
    return (
      <MDTypography color="error">{error}</MDTypography>
    );
  }

  // Define columns for the DataTable
  const columns = [
    { Header: 'Event', accessor: 'event', width: '45%', align: 'left' },
    { Header: 'Date', accessor: 'date', width: '20%', align: 'left' },
    { Header: 'Time', accessor: 'time', align: 'center' },
    { Header: 'Venue', accessor: 'venue', align: 'center' },
  ];

  // Return the Card component with the DataTable
  return (
    <Card sx={{ borderRadius: '3px' }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Upcoming Events
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: 'bold',
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>{rows.length} events</strong> found
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: 'pointer', fontWeight: 'bold' }} fontSize="small" onClick={() => console.log('Menu opened')}>
            more_vert
          </Icon>
        </MDBox>
      </MDBox>
      <MDBox
        height="250px"
        sx={{
          overflow: 'auto',
          borderRadius: '0 0 3px 3px', // Apply border-radius to bottom corners only
          '::-webkit-scrollbar': {
            width: '8px', // Width of the scrollbar
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Color of the scrollbar thumb
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Color when hovering over scrollbar thumb
          },
        }}
      >
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}
