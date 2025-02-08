const operations = require('./operations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.use((req, res, next) => {
    console.log('Middleware activated for profile API');
    next();
});

router.route('/profile').get(async (req, res) => {
    try {
        const studentId = req.cookies.student_id ? parseInt(req.cookies.student_id, 10) : 1001;
        const result = await operations.getStudentParentProfile(studentId);
        console.log('Fetched data:', result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching profile info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
