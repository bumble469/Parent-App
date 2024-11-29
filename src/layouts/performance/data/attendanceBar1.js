import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const ReportsBarChartWrapper = ({ semester }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  
  // Fallback to default semester value if semester is not passed or invalid
  const validSemester = semester >= 1 && semester <= 6 ? semester : 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure that semester is valid before making the API request
        if (validSemester < 1 || validSemester > 6) {
          throw new Error("Invalid semester value");
        }

        const response = await axios.get(`http://localhost:8080/api/performance/student/detailedattendance?semester=${validSemester}`);
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          // Step 1: Process the data to calculate attended and total lectures, excluding null values
          const subjectsData = response.data.reduce((acc, item) => {
            if (item.attended !== null) { // Exclude null values
              if (!acc[item.name]) {
                acc[item.name] = {
                  attended: 0,
                  total: 0,
                };
              }
              acc[item.name].total += 1; // Every entry counts as a total lecture
              if (item.attended) {
                acc[item.name].attended += 1; // Count attended lectures (true)
              }
            }
            return acc;
          }, {});

          // Step 2: Map the processed data to chart format
          const chartData = {
            labels: Object.keys(subjectsData),
            datasets: {
                attended: Object.values(subjectsData).map(subject => subject.attended),
                total: Object.values(subjectsData).map(subject => subject.total),
            }
          };

          setAttendanceData(Object.entries(subjectsData).map(([sub_name, data]) => ({
            sub_name,
            lectures_attended: data.attended,
            lectures_total: data.total,
          })));
          setData(chartData);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [validSemester]); // Dependency array now uses `validSemester`

  const rows = attendanceData.map((data) => ({
    subject: data.sub_name,
    attendedLectures: data.lectures_attended,
    totalLectures: data.lectures_total,
  }));

  const columns = [
    { Header: 'Subject', accessor: 'subject', width: '45%', align: 'left' },
    { Header: 'Lectures Attended', accessor: 'attendedLectures', width: '20%', align: 'left' },
    { Header: 'Lectures Occurred', accessor: 'totalLectures', align: 'center' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
          <MDTypography sx={{ fontSize: '13px' }}>
            Lectures Attended | Lectures Occurred
          </MDTypography>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        </MDBox>
      }
      chart={data}
      options={{
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      }}
    />
  );
};

export default ReportsBarChartWrapper;
