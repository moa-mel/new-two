const express = require('express');
const getGeo = require("./geoController")

const app = express();
const port =  5050;

app.get('/api/hello', getGeo);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
