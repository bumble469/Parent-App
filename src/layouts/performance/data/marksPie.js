import { useMemo } from 'react';

const generatePieChartData = (currentMarksData) => {
  return useMemo(() => {
    const subjects = currentMarksData.map((data) => data.subject);
    // Generate datasets for all 7 subjects and their corresponding marks for each type
    const datasets = [
      {
        label: 'Interim',
        data: currentMarksData.map((data) => data.interim),
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.4)',
        pointBackgroundColor: '#FF5733',
      },
      {
        label: 'SLE',
        data: currentMarksData.map((data) => data.sle),
        borderColor: '#33FF57',
        backgroundColor: 'rgba(51, 255, 87, 0.4)',
        pointBackgroundColor: '#33FF57',
      },
      {
        label: 'Internals',
        data: currentMarksData.map((data) => data.internals),
        borderColor: '#3357FF',
        backgroundColor: 'rgba(51, 87, 255, 0.4)',
        pointBackgroundColor: '#3357FF',
      },
      {
        label: 'Practicals',
        data: currentMarksData.map((data) => data.practicals),
        borderColor: '#FF33A1',
        backgroundColor: 'rgba(255, 51, 161, 0.4)',
        pointBackgroundColor: '#FF33A1',
      },
      {
        label: 'Theory',
        data: currentMarksData.map((data) => data.theory),
        borderColor: '#FFCC33',
        backgroundColor: 'rgba(255, 204, 51, 0.4)',
        pointBackgroundColor: '#FFCC33',
      },
    ];

    return {
      labels: subjects,
      datasets,
    };
  }, [currentMarksData]);
};

export default generatePieChartData;
