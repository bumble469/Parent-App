import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart'; // Import the ReportsBarChart component
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const ReportsBarChartWrapper = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [attendanceData, setAttendanceData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/dashboard/student/attendance');
        console.log('API Response:', response.data); // Log to check the data
        if (Array.isArray(response.data)) {
          setAttendanceData(response.data);
        } else {
          throw new Error('Invalid data format'); // Throw error for unexpected data structure
        }
        // Mapping the API response data to the required chart format
        const subjects = response.data.map(item => item.sub_name);
        const attended_lects = response.data.map(item => item.lectures_attended);
        const total_lects = response.data.map(item => item.lectures_total);

        // Construct the data object to match the chart format
        const chartData = {
          labels: subjects,
          datasets: {
            attended: attended_lects,
            total: total_lects,
          },
        };
        // Set the data for the chart
        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const rows = (attendanceData || []).map((data) => ({
    subject: data.sub_name, // Display subject name
    attendedLectures: data.lectures_attended, // Display attended lectures
    totalLectures: data.lectures_total, // Display total lectures
  }));

  const columns = [
    { Header: 'Subject', accessor: 'subject', width: '45%', align: 'left' },
    { Header: 'Lectures Attended', accessor: 'attendedLectures', width: '20%', align: 'left' },
    { Header: 'Lectures Occurred', accessor: 'totalLectures', align: 'center' },
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if there's an issue
  }

  // Handle no data case
  if (!attendanceData.length) {
    return (
      <div>No data available</div> // Display message if there's no data
    );
  }

  // If data is successfully fetched, render the ReportsBarChart
  return (
    <ReportsBarChart
      color="info"
      title="Subject-Wise Attendance"
      description={
        <MDBox
          sx={{
            height: '200px', // Set the height of the scrollable container
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Disable horizontal scrolling
            borderRadius: '8px', // Optional: Add rounded corners
            '::-webkit-scrollbar': {
              width: '8px', // Width of the scrollbar
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // Color of the scrollbar thumb
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555', // Color on hover
            },
          }}
        >
          <MDTypography sx={{ fontSize: '13px' }}>Lectures Attended | Lectures Occurred</MDTypography>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        </MDBox>
      }
      date="date"
      chart={data} // Pass the mapped data to the chart
      options={{
        // Adding x-axis label rotation for better visibility
        scales: {
          x: {
            ticks: {
              autoSkip: false, // Prevent auto-skipping of labels
              maxRotation: 45, // Rotate labels by 45 degrees
              minRotation: 45, // Set minimum rotation for consistency
            },
          },
        },
      }}
    />
  );
};

export default ReportsBarChartWrapper;
