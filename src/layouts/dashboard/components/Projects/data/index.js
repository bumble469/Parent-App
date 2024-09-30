/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Import the event data from eventData.js
import events from './eventData';

export default function data() {
  // Event component to display each event
  const Event = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  // Map through the events array to generate rows
  const rows = events.map((event) => ({
    event: <Event name={event.name} />,
    date: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {event.date}
      </MDTypography>
    ),
    time: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {event.time}
      </MDTypography>
    ),
    venue: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {event.venue}
      </MDTypography>
    ),
  }));

  return {
    columns: [
      { Header: 'Event', accessor: 'event', width: '45%', align: 'left' },
      { Header: 'Date', accessor: 'date', width: '10%', align: 'left' },
      { Header: 'Time', accessor: 'time', align: 'center' },
      { Header: 'Venue', accessor: 'venue', align: 'center' },
    ],

    rows,
  };
}
