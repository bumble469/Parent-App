const data = {
  labels: ['Linux', 'DevOps', 'SPM', 'DWM', 'INS'],
  datasets: {
    attended: [10, 14, 10, 18, 15],
    total: [12, 15, 10, 25, 22],
  },
};

// Function to calculate overall attendance percentages
export const calculateOverallAttendance = (attended, total) => {
  return attended.map((att, index) => {
    const tot = total[index];
    return ((att / tot) * 100).toFixed(2); // Two decimal places
  });
};

// Export data for use in other parts of the application
export default data;
