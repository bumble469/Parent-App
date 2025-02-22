import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart/index'; // Import the ReportsLineChart component
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import loading_image from '../../../assets/images/icons8-loading.gif';
import Cookies from 'js-cookie';
const ReportsLineChartWrapper = () => {
  const [data, setData] = useState(null); // State to hold the fetched chart data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [marksData, setMarksData] = useState([]);
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const { t } = useTranslation(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${REST_API_URL}/api/dashboard/student/graph`,{
          prn:prn
        });
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
          datasets: { label: t('marksLabel'), data: marks }, // Localized label for Marks
        };
        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [t]); // Empty dependency array ensures this effect runs only once on mount

  const rows = (marksData || []).map((data) => ({
    subject: data.sub_name || NaN, // Display subject name
    totalMarks: data.totalMarks || NaN, // Display attended lectures
    totalPossibleMarks: data.totalPossibleMarks || NaN, // Display total lectures
  }));

  const columns = [
    { Header: t('subject'), accessor: 'subject', width: '45%', align: 'left' },
    { Header: t('marksObtained'), accessor: 'totalMarks', width: '20%', align: 'left' },
    { Header: t('outOf'), accessor: 'totalPossibleMarks', align: 'center' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <img src={loading_image} alt={t('loading')} height="40px" width="40px" />
      </div>
    );
  }  

  if (error) {
    return <div>{t('error')}: {error.message}</div>; // Show error message if there's an issue
  }

  // If data is successfully fetched, render the ReportsLineChart
  return (
    <div>
      {loading?(
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <img src={loading_image} alt="Loading" style={{ width: '50px', height: '50px' }} />
      </Box>
      ) : (
        <ReportsLineChart
          color="success"
          title={t('subjectWiseMarks')}
          description={
            <MDBox
              sx={{
                height: '200px',
                overflowY: 'auto',
                overflowX: 'hidden',
                borderRadius: '8px',
                '::-webkit-scrollbar': {
                  width: '8px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              <MDTypography sx={{fontSize:"0.9rem"}}>{t('outOf145')}</MDTypography>
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
      )}
    </div>
  );
};

export default ReportsLineChartWrapper;
