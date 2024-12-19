import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          tension: 0.4, // Smooth curve
          pointRadius: 5,
          pointBorderColor: 'rgba(255, 255, 255, .8)', // White border around points
          pointBackgroundColor: 'rgba(60, 179, 113, 1)', // Contrast green for the point
          borderColor: 'rgba(255, 255, 255, .8)', // Line color
          borderWidth: 4,
          backgroundColor: 'transparent',
          fill: false, // Line without fill
          data: datasets.data, // Data points
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Hides legend
        },
        datalabels: {
          display: true, // Always show labels
          color: '#fff', // White text for labels
          align: 'top', // Align above the data point
          font: {
            size: 12,
            weight: 'bold',
          },
          formatter: (value) => value.toFixed(2), // Round numbers to 2 decimal places
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            borderDash: [5, 5],
            color: 'rgba(255, 255, 255, .2)',
          },
          ticks: {
            display: true,
            color: '#f8f9fa', // White text for y-axis ticks
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: '"Noto Sans", "Helvetica", "Arial", sans-serif',
              style: 'normal',
              lineHeight: 2,
            },
          },
          max: 135,
          min:80
        },
        x: {
          grid: {
            drawBorder: true,
            display: true, // Hides x-axis grid
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: '#f8f9fa', // White text for x-axis ticks
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
  };
}

export default configs;