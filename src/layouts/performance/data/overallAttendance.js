import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';

function OverallAttendance({ semester }) {
  const [overallAttendance, setOverallAttendance] = useState(0);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/performance/student/detailedattendance?semester=${semester}`);
        const data = await response.json();
        
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
      fetchAttendanceData();
    }
  }, [semester]);

  return (
    <ComplexStatisticsCard
      color="info"
      icon="check_circle"
      title="Overall Attendance"
      count={`${overallAttendance}%`}
      percentage={{
        color: overallAttendance >= 75 ? 'success' : 'error',
        amount: `${overallAttendance >= 75 ? '+' : ''}${overallAttendance}%`,
        label: overallAttendance >= 75 ? 'On track' : 'Below 75%',
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
