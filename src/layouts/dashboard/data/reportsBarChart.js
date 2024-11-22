import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart'; // Import the ReportsBarChart component

const ReportsBarChartWrapper = () => {
  const [data, setData] = useState(null); // State to hold the fetched chart data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dashboard/student/graph');
        console.log('API Response:', response.data); // Log to check the data

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

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if there's an issue
  }

  // If data is successfully fetched, render the ReportsBarChart
  return (
    <ReportsBarChart
      color="info"
      title="Subject Wise Attendance"
      description="Lectures Attended / Lectures Occurred"
      date="campaign sent 2 days ago"
      chart={data} // Pass the mapped data to the chart
      options={{
        // Adding x-axis label rotation for better visibility
        scales: {
          x: {
            ticks: {
              autoSkip: false, // Prevent auto-skipping of labels
              maxRotation: 45,  // Rotate labels by 45 degrees
              minRotation: 45,  // Set minimum rotation for consistency
            },
          },
        },
      }}
    />
  );
};

export default ReportsBarChartWrapper;
