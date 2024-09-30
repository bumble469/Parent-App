
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const facultyRoutes = require('./facultyapi/api');  
const chatRoutes = require('./chatapi/api');  

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
