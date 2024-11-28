const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const facultyRoutes = require('./facultyapi/api');  
const chatRoutes = require('./chatapi/api');  
const eventsRoutes = require('./dashboardapi/events/events_api');
const studentProfileRoutes = require('./profileapi/api');
const studentDashboardStarRoutes = require('./dashboardapi/starapi/api');
const studentDashboardGraphRoutes = require('./dashboardapi/graphapi/api')
const studentPerformanceRoutes = require('./performanceapi/api');
const studentCurrentSemesterRoutes = require('./navbarapi/api');
const getStudentAchievementsForPerformance = require('./performanceapi/achievementsapi/api');
const getStudentDetailedAttendanceForPerformance = require('./performanceapi/detailedAttendanceApi/api')

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for URL: ${req.url}`);
    next();
});

app.use('/api', facultyRoutes); 
app.use('/api/chat', chatRoutes); 
app.use('/api/events', eventsRoutes);
app.use('/api/student', studentProfileRoutes);
app.use('/api/dashboard', studentDashboardStarRoutes);
app.use('/api/dashboard', studentDashboardGraphRoutes);
app.use('/api/performance', studentPerformanceRoutes);
app.use('/api/student', studentCurrentSemesterRoutes);
app.use('/api/performance', getStudentAchievementsForPerformance);
app.use('/api/performance', getStudentDetailedAttendanceForPerformance)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
