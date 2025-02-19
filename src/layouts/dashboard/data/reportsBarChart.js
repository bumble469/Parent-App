import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart'; // Import the ReportsBarChart component
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useTranslation } from 'react-i18next';
import loading_image from '../../../assets/images/icons8-loading.gif'
import Cookies from 'js-cookie';
const ReportsBarChartWrapper = () => {
  const { t } = useTranslation(); // Use the translation hook
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [attendanceData, setAttendanceData] = useState([]); 
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8001/api/dashboard/student/attendance',{
          prn:prn
        });
        if (Array.isArray(response.data)) {
          setAttendanceData(response.data);
        } else {
          throw new Error('Invalid data format'); 
        }
        
        const subjects = response.data.map(item => item.sub_name);
        const attended_lects = response.data.map(item => item.lectures_attended);
        const total_lects = response.data.map(item => item.lectures_total);

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
    { Header: t('subject'), accessor: 'subject', width: '45%', align: 'left' },
    { Header: t('lecturesAttended'), accessor: 'attendedLectures', width: '20%', align: 'left' },
    { Header: t('lecturesOccurred'), accessor: 'totalLectures', align: 'center' },
  ];

  if (error) {
    return <div>{t('error')}: {error.message}</div>;
  }

  if (!attendanceData.length) {
    return (
      <div>{t('noDataAvailable')}</div> 
    );
  }

  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
         <img src={loading_image} alt="Loading" style={{ width: '50px', height: '50px' }} />
        </Box>
      ) : (
        <ReportsBarChart
          color="info"
          title={t('subjectWiseAttendance')}
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
              <MDTypography sx={{ fontSize: '0.9rem' }}>
                {t('lecturesAttended')} | {t('lecturesOccurred')}
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
          date="date"
          chart={data} // Pass the mapped data to the chart
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
      )}
    </div>
  );  
};

export default ReportsBarChartWrapper;
