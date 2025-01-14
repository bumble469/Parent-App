const operations = require('./operations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router(); 

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.use((req, res, next) => {
    next();
});

router.route('/faculty').get(async (req, res) => {
    try {
        const result = await operations.getFaculty();
        res.json(result);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
