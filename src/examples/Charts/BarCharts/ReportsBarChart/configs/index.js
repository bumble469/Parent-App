import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [
        {
          label: 'Lectures Attended',
          backgroundColor: 'rgb(70,140,90,0.72)',
          borderColor: '#dcdcdc',
          borderWidth: 1,
          data: datasets.attended,
          maxBarThickness: 11,
          borderRadius: 7,
        },
        {
          label: 'Total Lectures',
          backgroundColor: 'rgb(70, 90, 140,0.72)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          data: datasets.total,
          maxBarThickness: 11,
          borderRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#fff', // Set label color to white
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ': ' + context.raw;
            },
          },
        },
        // Enable datalabels plugin
        datalabels: {
          display: true, // Ensure labels are always visible
          color: '#fff', // White text
          anchor: 'center', // Center align the labels
          align: 'center', // Center text vertically
          font: {
            size: 15,
            weight: 'bold',
          },
          formatter: function (value) {
            return value; // Display the value
          },
        },
      },
      scales: {
        y: {
          min: 1, // Set minimum value of y-axis to 1
          max: 100, // Set maximum value of y-axis to 50
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: 'rgba(255, 255, 255, .2)',
          },
          ticks: {
            stepSize: 5, // Adjust step size for y-axis ticks
            padding: 5,
            font: {
              size: 14,
              weight: 300,
              family: '"Noto Sans", "Helvetica", "Arial", sans-serif',
              style: 'normal',
              lineHeight: 2,
            },
            color: '#fff',
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false, // Hide x-axis grid lines
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
            color: 'rgba(255, 255, 255, .2)',
          },
          ticks: {
            display: true,
            color: '#f8f9fa',
            padding: 5,
            font: {
              size: 14,
              weight: 300,
              family: '"Noto Sans", "Helvetica", "Arial", sans-serif',
              style: 'normal',
              lineHeight: 2,
            },
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Register the datalabels plugin
  };
}



export default configs;