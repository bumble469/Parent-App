import { useMemo } from 'react';

const generateMarksLineChartData = (currentMarksData) => {
  return useMemo(
    () => ({
      series: [
        {
          name: 'Total Marks',
          data: currentMarksData.map((data) => data.total),
        },
      ],
      chartOptions: {
        chart: {
          type: 'line', // Change from 'bar' to 'line'
          height: 350,
          zoom: {
            enabled: false, // Disable zoom
          },
        },
        stroke: {
          curve: 'smooth', // Smooth lines for a better visual appeal
          width: 4, // Increased line thickness for better visibility
        },
        xaxis: {
          categories: currentMarksData.map((data) => data.subject), // Subject names as categories
          title: {
            text: 'Subjects',
            style: {
              fontSize: '14px', // Larger font size for better readability
              fontWeight: 600, // Bold font
            },
          },
        },
        yaxis: {
          title: {
            text: 'Total Marks',
            style: {
              fontSize: '14px', // Larger font size for better readability
              fontWeight: 600, // Bold font
            },
          },
          labels: {
            formatter: function (value) {
              return value.toFixed(0); // Format Y-axis values to remove decimals (optional)
            },
            style: {
              fontSize: '12px', // Larger font size for Y-axis labels
              fontWeight: 500, // Medium font weight for Y-axis labels
            },
          },
          tickAmount: 10, // Increase or decrease to set the number of ticks
          max: 450,
        },
        colors: ['#1E90FF'], // Line color: blue
        dataLabels: {
          enabled: true, // Enable data labels for clarity
          style: {
            fontSize: '12px', // Larger font for labels
          },
        },
        markers: {
          size: 6, // Increased marker size for better visibility
          colors: ['#1E90FF'], // Marker color: blue
        },
        tooltip: {
          theme: 'dark', // Dark theme for tooltips
          marker: {
            show: true, // Show the marker on hover
          },
          style: {
            fontSize: '14px', // Larger font for tooltips
          },
        },
        grid: {
          borderColor: '#e7e7e7', // Light grid lines to keep the chart clean
        },
        annotations: {
          yaxis: [
            {
              y: 400, // Add an annotation line at 400 marks
              borderColor: '#FF0000',
              borderWidth: '1.5px',
              label: {
                text: 'High Mark Threshold --', // Set label text
                style: {
                  color: '#fff', // White text
                  background: 'rgb(250,50,50)', // Red background
                  fontSize: '12px', // Font size for the label
                  padding: {
                    top: 8,
                    bottom: 8,
                    left: 12,
                    right: 12,
                  },
                },
                offsetX: -20, // Adjust horizontal positioning
                offsetY: -140, // Move label above the line to avoid overlap
              },
            },
          ],
        },
      },
    }),
    [currentMarksData]
  );
};

export default generateMarksLineChartData;
