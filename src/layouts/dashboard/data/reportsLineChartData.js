import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart/index'; // Import the ReportsBarChart component
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const ReportsLineChartWrapper = () => {
  const [data, setData] = useState(null); // State to hold the fetched chart data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/student/graph');
        if (Array.isArray(response.data)) {
          setMarksData(response.data);
        } else {
          throw new Error('Invalid data format'); // Throw error for unexpected data structure
        }
        // Mapping the API response data to the required chart format
        const subjects = response.data.map(item => item.sub_name);
        const marks = response.data.map(item => item.totalMarks);
        // Construct the data object to match the chart format
        const chartData = {
          labels: subjects,
          datasets: { label: 'Marks', data: marks },
          
        };
        console.log("my marks: "+ marks)
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

  const rows = (marksData || []).map((data) => ({
    subject: data.sub_name, // Display subject name
    totalMarks: data.totalMarks, // Display attended lectures
    totalPossibleMarks: data.totalPossibleMarks, // Display total lectures
  }));

  const columns = [
    { Header: 'Subject', accessor: 'subject', width: '45%', align: 'left' },
    { Header: 'Marks Obtained', accessor: 'totalMarks', width: '20%', align: 'left' },
    { Header: 'Out Of', accessor: 'totalPossibleMarks', align: 'center' },
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if there's an issue
  }

  // If data is successfully fetched, render the ReportsBarChart
  return (
    <ReportsLineChart
      color="success"
      title="Subject-Wise Marks"
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
          <MDTypography sx={{fontSize:"13px"}}>out of 145 (average is based on all exams conducted)</MDTypography>
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

export default ReportsLineChartWrapper;
