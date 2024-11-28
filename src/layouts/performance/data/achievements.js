// api.js
export const fetchAchievements = async (semester) => {
  try {
    // Include the semester parameter in the API URL
    const response = await fetch(`http://localhost:8080/api/performance/student/achievements?semester=${semester}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
};
