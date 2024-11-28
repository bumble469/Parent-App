export const generateAttendanceBarChartData = (averageAttendanceBySubject) => {
  return {
    series: [
      {
        name: 'Average Attendance',
        data: averageAttendanceBySubject.map((data) => data.averageAttendance),
      },
    ],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderColor: 'black',
          columnWidth: '40%',
          dataLabels: {
            enabled: true,
          },
          shadow: {
            enabled: true,
            blur: 5,
            color: 'rgba(0, 0, 0, 0.6)',
            offsetX: 5,
            offsetY: 5,
          },
        },
      },
      xaxis: {
        categories: averageAttendanceBySubject.map((data) => data.subject),
        title: {
          text: 'Subjects',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Average Attendance (%)',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
          },
        },
        min: 1,
        max: 100,
        tickAmount: 10,
      },
      colors: ['rgb(80, 200, 120)'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.9,
          gradientToColors: ['rgb(0, 98, 0)'],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        formatter: function (value) {
          return `${value}`;
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
        },
        y: {
          formatter: function (value) {
            return `${value}%`;
          },
        },
      },
      legend: {
        position: 'top',
        labels: {
          colors: '#000',
        },
      },
      grid: {
        show: true,
        borderColor: 'rgba(0, 0, 0, .2)',
        strokeDashArray: 5,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    },
  };
};
