import React, { useEffect, useState, useMemo } from "react";
import ApexCharts from "react-apexcharts";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useTranslation } from 'react-i18next'; 
import loading_image from '../../../assets/images/icons8-loading.gif'; // Add the loading gif import

const generateMarksLineChartData = (currentMarksData, threshold) => {
  const minMarks = Math.min(...currentMarksData.map((data) => data.total));
  const {t} = useTranslation();
  return useMemo(
    () => ({
      series: [
        {
          name: "Total Marks",
          data: currentMarksData.map((data) => data.total),
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          height: 350,
          zoom: { enabled: false },
        },
        stroke: {
          curve: "smooth",
          width: 4,
        },
        xaxis: {
          categories: currentMarksData.map((data) => data.subject),
          title: {
            text: t('subject'),
            style: { fontSize: '0.9rem', fontWeight: 600 },
          },
        },
        yaxis: {
          title: {
            text: t('TotalMarks'),
            style: { fontSize: "0.9rem", fontWeight: 600 },
          },
          labels: {
            formatter: (value) => value.toFixed(0),
            style: { fontSize: "0.8rem", fontWeight: 500 },
          },
          tickAmount: 15,
          max: 145, 
          min: minMarks - 30, 
        },
        colors: ["#1E90FF"],
        dataLabels: {
          enabled: true,
          style: { fontSize: "12px" },
        },
        markers: {
          size: 6,
          colors: ["#1E90FF"],
        },
        tooltip: {
          theme: "dark",
          marker: { show: true },
          style: { fontSize: "14px" },
        },
        grid: {
          borderColor: "#e7e7e7",
        },
        annotations: {
          yaxis: [
            {
              y: threshold,
              borderColor: "#FF0000",
              borderWidth: "1.5px",
              label: {
                text: `High Mark Threshold: ${threshold}`,
                style: {
                  color: "#fff",
                  background: "rgb(250,50,50)",
                  fontSize: "12px",
                  padding: { top: 3, bottom: 3, left: 3, right: 3 },
                },
                offsetX: -10, 
                offsetY: -30, 
              },
            },
          ],
        },
      },
    }),
    [currentMarksData, threshold]
  );
};

const LineGraph = ({ semester, threshold = 95 }) => {
  const { t } = useTranslation(); 
  const [marksData, setMarksData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [loading, setLoading] = useState(true);  // Add loading state

  const fetchMarksData = async (semester) => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await fetch(
        `http://localhost:8001/api/performance/student/detailedmarks?semester=${semester}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setMarksData(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching marks data:", error);
    } finally {
      setLoading(false); // Set loading to false after data fetching
    }
  };

  useEffect(() => {
    fetchMarksData(semester);
  }, [semester]);

  const groupedMarksData = marksData.reduce((acc, { subject_name, marks_obtained }) => {
    if (!acc[subject_name]) {
      acc[subject_name] = { earned: 0, total: 0 };
    }
    acc[subject_name].total += marks_obtained;
    return acc;
  }, {});

  const filteredMarksData =
    selectedSubject === "All"
      ? Object.keys(groupedMarksData).map((subject) => ({
          subject,
          total: groupedMarksData[subject].total,
        }))
      : [
          {
            subject: selectedSubject,
            total: groupedMarksData[selectedSubject].total,
          },
        ];

  const chartData = generateMarksLineChartData(filteredMarksData, threshold);

  return (
    <Card>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="success"
        borderRadius="lg"
        coloredShadow="success"
      >
        <MDTypography variant="h6" color="white">
          {t('Total Marks Line Graph')} 
        </MDTypography>
      </MDBox>
      <MDBox pt={3} px={3}>
        {/* Loading indicator */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <img src={loading_image} alt="Loading..." />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', fontSize: '0.95rem', border: '1px solid #ddd', marginRight: '20px' }}
              >
                <option value="All">{t('All Subjects')}</option> 
                {Object.keys(groupedMarksData).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Graph */}
            <ApexCharts
              type="line"
              series={chartData.series}
              options={chartData.chartOptions}
              height={350}
            />
          </>
        )}
      </MDBox>
    </Card>
  );
};

export default LineGraph;
