import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Projects from 'layouts/dashboard/events/index';
import ReportsBarChartWrapper from './data/reportsBarChart';
import ReportsLineChartWrapper from './data/reportsLineChartData';
import { calculateStarRating } from './data/overallrating'; 
import StarIcon from '@mui/icons-material/Star'; 
import StarBorderIcon from '@mui/icons-material/StarBorder'; 
import StarHalfIcon from '@mui/icons-material/StarHalf';
import SubjectDashboard from './data/strongweaksubjects';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
function Dashboard() {
  const [loading, setLoading] = useState(true);
const [progress, setProgress] = useState(0);
const [message, setMessage] = useState("Activating API's..");
const [timeoutReached, setTimeoutReached] = useState(false);
const [error, setError] = useState(null);
const [studentData, setStudentData] = useState(null);
const { t, i18n } = useTranslation();
const prn = Cookies.get("student_id") ? parseInt(Cookies.get("student_id"), 10) : 1001;
const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
const isHindi = i18n.language !== "en";

useEffect(() => {
  const fetchData = async () => {
    try {
      setProgress(33); 
      setMessage("Activating API's..");

      const response = await axios.post(`${REST_API_URL}/api/dashboard/student/star`, { prn });

      if (response.data && response.data.length > 0) {
        setTimeout(() => {
          setProgress(66);
          setMessage("Generating Insights..");
        }, 500);

        setTimeout(() => {
          setProgress(100);
          setMessage("Encrypting Data..");
        }, 1000);

        setStudentData(response.data);
      } else {
        setStudentData([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  fetchData();
}, []);


if (error) return <div>Error: {error.message}</div>;
  const marksData = studentData?.map((item) => item.marks_obtained) || [];
  const totalMarksData = studentData?.map((item) => item.max_marks) || [];
  const attendanceData = studentData?.map((item) => item.total_lectures_attended) || [];
  const totalAttendanceData = studentData?.map((item) => item.total_lectures_conducted) || [];

  const totalMarks = marksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleMarks = totalMarksData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalAttendance = attendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;
  const totalPossibleAttendance = totalAttendanceData?.reduce((acc, curr) => acc + curr, 0) || 0;

  const overallMarksPercentage = totalMarks && totalPossibleMarks ? (totalMarks / totalPossibleMarks) * 100 : 0;
  const overallAttendancePercentage = totalAttendance && totalPossibleAttendance ? (totalAttendance / totalPossibleAttendance) * 100 : 0;

  const overallMarksFromAPI = overallMarksPercentage;
  const averageAttendanceFromAPI = overallAttendancePercentage;

  const { starRating, fullStars, halfStar, emptyStars, ratingMessage } = calculateStarRating(
    overallMarksFromAPI,
    averageAttendanceFromAPI,
    t
  );

  let labelMessageForOverallMarks = {
    message: '',
    color: ''
  };
  let labelMessageForOverallAttendance = {
    message: '',
    color: ''
  };

  if (!overallMarksFromAPI || isNaN(overallMarksFromAPI)) {
    labelMessageForOverallMarks.message = t("No marks records detected..");
    labelMessageForOverallMarks.color = "info";
  } else if (overallMarksFromAPI < 50) {
    labelMessageForOverallMarks.message = t("Needs Improvement!");
    labelMessageForOverallMarks.color = "error";
  } else if (overallMarksFromAPI < 75) {
    labelMessageForOverallMarks.message = t("Can do better..");
    labelMessageForOverallMarks.color = "warning";
  } else {
    labelMessageForOverallMarks.message = t("Good, Keep It Up!");
    labelMessageForOverallMarks.color = "success";
  }
  
  if (!overallAttendancePercentage || isNaN(overallAttendancePercentage)) {
    labelMessageForOverallAttendance.message = t("No attendance records detected..");
    labelMessageForOverallAttendance.color = "info";
  } else if (overallAttendancePercentage < 50) {
    labelMessageForOverallAttendance.message = t("Needs Improvement!");
    labelMessageForOverallAttendance.color = "error";
  } else if (overallAttendancePercentage < 75) {
    labelMessageForOverallAttendance.message = t("Can do better..");
    labelMessageForOverallAttendance.color = "warning";
  } else {
    labelMessageForOverallAttendance.message = t("Good, Keep It Up!");
    labelMessageForOverallAttendance.color = "success";
  }
  

  return(
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2} mt={3} mb={2}>
        <Grid container spacing={1}>
          {/* Overall Attendance */}
          <Grid item xs={12} md={6} lg={4} sx={{ mb: { xs:2 } }}>
            <MDBox>
              <ComplexStatisticsCard
                color="success"
                icon="weekend"
                title={<span style={{ fontSize: isHindi ? '1.1rem' : '1rem' }}>{t("Overall Attendance")}</span>}
                count={<span>{averageAttendanceFromAPI ? `${averageAttendanceFromAPI.toFixed(2)}%` : "N/A"}</span>}
                percentage={{
                  color: labelMessageForOverallAttendance.color,
                  amount: <span style={{ fontSize: isHindi ? '1rem' : 'inherit' }}>
                    {labelMessageForOverallAttendance.message || t('No data available to display.')}
                    </span>
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={averageAttendanceFromAPI ? Math.min(Math.max(averageAttendanceFromAPI, 0), 100) : 0}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
  
          {/* Overall Performance */}
          <Grid className="Overall-Marks" item xs={12} md={6} lg={4} sx={{ mb: { xs:2 } }}>
            <MDBox>
              <ComplexStatisticsCard
                icon="leaderboard"
                title={<span style={{ fontSize: isHindi ? '1.1rem' : '1rem' }}>{t("Overall Performance")}</span>}
                count={<span>{overallMarksFromAPI ? `${overallMarksFromAPI.toFixed(2)}%` : "N/A"}</span>}
                percentage={{
                  color: labelMessageForOverallMarks.color,
                  amount: <span style={{ fontSize: isHindi ? '1rem' : 'inherit' }}>{labelMessageForOverallMarks.message || t('No data available to display.')}</span>
                }}
              >
                <MDBox width="100%">
                  <progress
                    value={overallMarksFromAPI || 0}
                    max={100}
                    style={{ width: '100%' }}
                  ></progress>
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>
  
          {/* Rating */}
          <Grid item xs={12} md={12} lg={4} sx={{ mb: { xs:2 } }}>
            <MDBox>
              <ComplexStatisticsCard
                color="warning"
                icon="star"
                title={<span style={{ fontSize: isHindi ? '1.1rem' : '1rem' }}>{t("Rating")}</span>}
                count={<span>{(overallMarksFromAPI && averageAttendanceFromAPI) ? `${starRating}/5` : "NaN"}</span>}
                percentage={{
                  color: (overallMarksFromAPI && averageAttendanceFromAPI) ? 'success' : 'info',
                  label: <span style={{ fontSize: isHindi ? '1rem' : 'inherit' }}>
                    {(overallMarksFromAPI && averageAttendanceFromAPI) ? ratingMessage || "No data available" : "NaN"}
                  </span>
                }}
              >
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-evenly"
                  sx={{ pb: 1.45 }}
                >
                  {[...Array(fullStars || 0)].map((_, index) => (
                    <StarIcon key={`full-${index}`} color="warning" />
                  ))}
                  {halfStar === 1 && <StarHalfIcon key="half" color="warning" />}
                  {[...Array(emptyStars || 5)].map((_, index) => (
                    <StarBorderIcon key={`empty-${index}`} color="action" />
                  ))}
                </MDBox>
              </ComplexStatisticsCard>
            </MDBox>
          </Grid>

        </Grid>
  
        <MDBox mt={5}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChartWrapper />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3} borderRadius="3px">
                <ReportsLineChartWrapper />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
  
        {/* Subject Dashboard */}
        <SubjectDashboard />
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );  
}

export default Dashboard;
