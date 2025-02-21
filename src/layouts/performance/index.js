import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Card } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import MDTypography from 'components/MDTypography';
import LectureViewTable from "./data/lectures";
import AttendanceTable from './data/detailed_attendance';
import ReportsBarChartWrapper from './data/attendanceBar1';
import MarksTable from './data/detailed_marks';
import LineGraph from './data/marksGraphs';
import Footer from 'examples/Footer';
import OverallAttendance from './data/overallAttendance';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import axios from 'axios';
function Performance() {
  const [semester, setSemester] = useState(''); 
  const [semesters, setSemesters] = useState([]); 
  const [marksData, setMarksData] = useState([]); 
  const [averageMarks, setAverageMarks] = useState(0); 
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language != 'en'
  const handleSemesterChange = (event) => {
    setSemester(event.target.value); 
  };
  const prn = Cookies.get('student_id') ? parseInt(Cookies.get('student_id'), 10) : 1001;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8001/api/performance/student',{
          prn:prn
        });
        const data = response.data;
        const uniqueSemesters = Array.from(new Set(data.map(item => item.semester_id)))
          .map(id => ({
            id,
            name: `${t('Semester')} ${id}`,
          }));
        setSemesters(uniqueSemesters);
        if (uniqueSemesters.length > 0) {
          setSemester(uniqueSemesters[0].id); 
        }
        setMarksData(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [t]); // Adding t as a dependency to ensure translations are updated

  useEffect(() => {
    // Calculate average marks for the selected semester
    const filteredMarks = marksData.filter(item => item.semester_id === semester);

    const marksBySubject = filteredMarks.reduce((acc, item) => {
      const subjectId = item.subject_id;
      if (!acc[subjectId]) {
        acc[subjectId] = { totalMarks: 0, obtainedMarks: 0 };
      }
      acc[subjectId].totalMarks += item.max_marks;
      acc[subjectId].obtainedMarks += item.marks_obtained;
      return acc;
    }, {});

    let totalObtainedMarks = 0;
    let totalPossibleMarks = 0;

    Object.values(marksBySubject).forEach(subject => {
      totalObtainedMarks += subject.obtainedMarks;
      totalPossibleMarks += subject.totalMarks;
    });

    const avgMarks = totalPossibleMarks > 0 ? (totalObtainedMarks / totalPossibleMarks) * 100 : 0;
    setAverageMarks(avgMarks);
  }, [semester, marksData]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} container spacing={3} justifyContent="flex-start">
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 250,
                  m: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  padding: '8px',
                }}
              >
                <InputLabel
                  id="semester-select-label"
                  sx={{
                    fontSize: '1rem',
                    color: 'text.secondary',
                    padding: '0 8px',
                  }}
                >
                  {t('Select Semester')}
                </InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={semester}
                  onChange={handleSemesterChange}
                  label={t('Select Semester')}
                  sx={{
                    '& .MuiSelect-outlined': {
                      padding: '12px 16px',
                      fontSize: '1rem',
                      color: 'text.primary',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.dark',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  {semesters.length > 0 ? (
                    semesters.map((sem) => (
                      <MenuItem key={sem.id} value={sem.id}>
                        {sem.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>{t('No semesters available')}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <OverallAttendance prn={prn} semester={semester} t={t} i18n = {i18n} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox sx={{ height: '100%' }}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="leaderboard"
                    title={<span style={{ fontSize: isHindi ? '1.1rem' : '1rem' }}>{t("Average Grade")}</span>}
                    count={`${averageMarks.toFixed(2)}%`}
                    percentage={{
                      color: averageMarks >= 75 ? 'success':'error',
                      amount: `${averageMarks.toFixed(2)}%`,
                      label: averageMarks >= 75 ? t('On track') : t('Below 75%'),
                    }}
                  >
                    <MDBox width="100%">
                      <progress
                        value={Math.min(Math.max(averageMarks, 0), 100)}
                        max={100}
                        style={{ width: '100%' }}
                      ></progress>
                    </MDBox>
                  </ComplexStatisticsCard>
                </MDBox>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} mt={3}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {t('Subject-Wise Detailed Lecture Review')}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <LectureViewTable prn={prn} semester={semester} />
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} mt={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} mt={3} mb={3}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      {t('Subject-Wise Detailed Attendance')}
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    <AttendanceTable prn={prn} semester={semester} />
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} mt={1} mb={3}>
                <ReportsBarChartWrapper prn={prn} semester={semester} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} mt={3} mb={2}>
                <MarksTable prn={prn} semester={semester} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} mt={4} mb={2}>
                <LineGraph prn={prn} semester={semester} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Performance;
