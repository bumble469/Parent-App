import React, { useEffect, useState, useMemo } from "react";
import ApexCharts from "react-apexcharts";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Function to generate the line chart data and configuration
const generateMarksLineChartData = (currentMarksData, threshold) => {
  // Calculate the min and max values based on marks obtained
  const maxMarks = Math.max(...currentMarksData.map((data) => data.total));
  const minMarks = Math.min(...currentMarksData.map((data) => data.total));

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
            text: "Subjects",
            style: { fontSize: "14px", fontWeight: 600 },
          },
        },
        yaxis: {
          title: {
            text: "Total Marks",
            style: { fontSize: "14px", fontWeight: 600 },
          },
          labels: {
            formatter: (value) => value.toFixed(0),
            style: { fontSize: "12px", fontWeight: 500 },
          },
          tickAmount: 15,
          max: 145, // Add buffer to the max value
          min: minMarks - 30, // Add buffer to the min value
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
                offsetX: -10, // Adjust this value to place the label nicely
                offsetY: -30, // Adjust the vertical position to avoid overlap
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
  const [marksData, setMarksData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Fetch marks data for the selected semester
  const fetchMarksData = async (semester) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchMarksData(semester);
  }, [semester]);

  // Group data by subject
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

  // Generate chart data with dynamic Y-axis and threshold
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
          Total Marks Line Graph
        </MDTypography>
      </MDBox>
      <MDBox pt={3} px={3}>
        {/* Filter for Subjects */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd', marginRight: '20px' }}
          >
            <option value="All">All Subjects</option>
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
      </MDBox>
    </Card>
  );
};

export default LineGraph;
