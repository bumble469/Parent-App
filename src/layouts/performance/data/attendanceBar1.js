import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import DataTable from 'examples/Tables/DataTable';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import loading_image from '../../../assets/images/icons8-loading.gif';
import { Box } from '@mui/material';
import Cookies from 'js-cookie';
const ReportsBarChartWrapper = ({ prn, semester }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const validSemester = semester >= 1 && semester <= 6 ? semester : 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (validSemester < 1 || validSemester > 6) {
          throw new Error("Invalid semester value");
        }
        const response = await axios.post('http://localhost:8001/api/performance/student/detailedattendance',{
          prn:prn,
          semester:validSemester
        });
        if (Array.isArray(response.data)) {
          const subjectsData = response.data.reduce((acc, item) => {
            if (item.is_present !== null) { 
              if (!acc[item.subject_name]) {
                acc[item.subject_name] = {
                  attended: 0,
                  total: 0,
                };
              }
              acc[item.subject_name].total += 1; 
              if (item.is_present) {
                acc[item.subject_name].attended += 1; 
              }
            }
            return acc;
          }, {});

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
    console.log(`current semester value: ${validSemester}`)
    fetchData();
  }, [validSemester]); 

  const rows = attendanceData.map((data) => ({
    subject: data.sub_name,
    attendedLectures: data.lectures_attended,
    totalLectures: data.lectures_total,
  }));

  const columns = [
    { Header: t('subject'), accessor: 'subject', width: '45%', align: 'left' },
    { Header: t('lecturesAttended'), accessor: 'attendedLectures', width: '20%', align: 'left' },
    { Header: t('lecturesOccurred'), accessor: 'totalLectures', align: 'center' },
  ];

  if (error) {
    return <div>{t('error')}: {error.message}</div>;
  }

  return (
    <div>
      {loading?(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <img src={loading_image} alt="Loading" style={{ width: '50px', height: '50px' }} />
      </Box>
    ):(
      <ReportsBarChart
      color="info"
      title={t('subjectWiseAttendance')}
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
          <MDTypography sx={{ fontSize: '13px' }}>
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

export default ReportsBarChartWrapper;
