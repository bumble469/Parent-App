import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import Cookies from 'js-cookie';
import axios from 'axios';
function OverallAttendance({ prn, semester, t, i18n }) {
  const [overallAttendance, setOverallAttendance] = useState(0);
  const isHindi = i18n.language != 'en'
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  useEffect(() => {
    const fetchAttendanceData = async (semester) => {
      try {
        const response = await axios.post(`${REST_API_URL}/api/performance/student/detailedattendance`,{
          prn:prn,
          semester:semester
        });
        const data = await response.data;
        
        // Calculate overall attendance
        const totalClasses = data.filter(item => item.is_present === true || item.is_present === false).length;
        const attendedClasses = data.filter(item => item.is_present === true).length;
        const attendancePercentage = (attendedClasses / totalClasses) * 100;
        setOverallAttendance(attendancePercentage.toFixed(2)); // Save the attendance percentage with 2 decimal points
      } catch (error) {
        console.error('Error fetching overall attendance:', error);
      }
    };

    if (semester) {
      fetchAttendanceData(semester);
    }
  }, [semester]);

  return (
    <ComplexStatisticsCard
      color="info"
      icon="check_circle"
      title={<span style={{ fontSize: isHindi ? '1.1rem' : '1rem' }}>{t('Overall Attendance')}</span>}
      count={`${overallAttendance}%`}
      percentage={{
        color: overallAttendance >= 75 ? 'success' : 'error',
        amount: `${overallAttendance >= 75 ? '+' : ''}${overallAttendance}%`,
        label: overallAttendance >= 75 ? t('On track') : t('Below 75%'),
      }}
    >
      <Box width="100%">
        <progress
          value={Math.min(Math.max(overallAttendance, 0), 100)}
          max={100}
          style={{ width: '100%' }}
        ></progress>
      </Box>
    </ComplexStatisticsCard>
  );
}

export default OverallAttendance;
