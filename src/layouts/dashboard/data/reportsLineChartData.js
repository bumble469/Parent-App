/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
export const calculateOverallMarks = (marksArray) => {
  const sum = marksArray.reduce((acc, mark) => acc + mark, 0);
  const overallMarks = sum / marksArray.length;
  return overallMarks;
};

// Data for charts
const data = {
  marks: {
    labels: ['Linux', 'DevOps', 'SPM', 'DWM', 'INS'],
    datasets: { label: 'Marks', data: [81, 90, 57, 67, 90] },
  },
};

// Calculate overall marks using the function
const overallMarks = calculateOverallMarks(data.marks.datasets.data);

// Export the data and overall marks
export default {
  ...data,
  overallMarks,
};
