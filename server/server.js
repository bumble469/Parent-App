const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const facultyRoutes = require('./facultyapi/api');
const chatRoutes = require('./chatapi/api');
const eventsRoutes = require('./dashboardapi/events/events_api');
const studentProfileRoutes = require('./profileapi/api');
const studentDashboardStarRoutes = require('./dashboardapi/starapi/api');
const studentDashboardGraphRoutes = require('./dashboardapi/graphapi/api');
const studentPerformanceRoutes = require('./performanceapi/api');
const studentCurrentSemesterRoutes = require('./navbarapi/api');
const getStudentDetailedAttendanceForPerformance = require('./performanceapi/detailedAttendanceApi/api');
const getStudentDetailedMarksForPerformance = require('./performanceapi/detailedMarksApi/api');
const getStudentDashboardAttendance = require('./dashboardapi/attendanceapi/api');
const getLectureDetails = require('./performanceapi/lectureApi/api');

const app = express();
const port = process.env.PORT || 8001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for URL: ${req.url}`);
    next();
});

const RETRY_LIMIT = 5;
const RETRY_DELAY = 1000;

const loadRoutes = async () => {
    try {
        console.log("Preloading routes...");
        await loadRoute('/api/student', studentProfileRoutes, studentCurrentSemesterRoutes);
        await loadRoute('/api/dashboard', studentDashboardStarRoutes, studentDashboardGraphRoutes, getStudentDashboardAttendance);
        await loadRoute('/api/events', eventsRoutes);
        await loadRoute('/api/performance', studentPerformanceRoutes);
        await loadRoute('/api/performance', getLectureDetails);
        await loadRoute('/api/performance', getStudentDetailedAttendanceForPerformance);
        await loadRoute('/api/performance', getStudentDetailedMarksForPerformance);
        await loadRoute('/api', facultyRoutes);
        app.use('/api/chat', chatRoutes);

        console.log("Routes loaded successfully.");
    } catch (error) {
        console.error("Error loading routes:", error);
        for (let i = 0; i < RETRY_LIMIT; i++) {
            console.log(`Retrying route loading... Attempt ${i + 1}`);
            try {
                await loadRoute('/api/student', studentProfileRoutes, studentCurrentSemesterRoutes);
                await loadRoute('/api/dashboard', studentDashboardStarRoutes, studentDashboardGraphRoutes, getStudentDashboardAttendance);
                await loadRoute('/api/events', eventsRoutes);
                await loadRoute('/api/performance', studentPerformanceRoutes);
                await loadRoute('/api/performance', getLectureDetails);
                await loadRoute('/api/performance', getStudentDetailedAttendanceForPerformance);
                await loadRoute('/api/performance', getStudentDetailedMarksForPerformance);
                await loadRoute('/api', facultyRoutes);
                app.use('/api/chat', chatRoutes);
                console.log("Routes loaded successfully after retry.");
                break;
            } catch (retryError) {
                console.error("Retry failed:", retryError);
                if (i === RETRY_LIMIT - 1) {
                    console.error("Maximum retry attempts reached. Server will restart.");
                    restartServer();
                }
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
};

const loadRoute = async (routePath, ...routes) => {
    try {
        app.use(routePath, ...routes);
    } catch (error) {
        throw error;
    }
};

const restartServer = () => {
    console.log("Restarting the server...");
    exec('pm2 restart server', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error restarting server: ${err}`);
            return;
        }
        console.log(`Server restarted: ${stdout}`);
    });
};

app.listen(port, async () => {
    await loadRoutes();
    console.log(`Server is running at http://localhost:${port}`);
});
