var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(express.static(__dirname + '/public'));

app.get('/content', function (req, res) {
    res.send('<h1>Hello from Open Shift - Static Message</h1>');
});

var websites = [
    { name: "Site1" }, { name: "Site2" }, { name: "Site3" }, { name: "Site4" }
];

app.get("/api/website", function (req, resp) {
    resp.json(websites);
});

app.post("/api/website", function (req, resp) {
    websites.push(req.body);
    resp.json(websites);
});


app.get("/api/website/:id", function (req, resp) {
    resp.json(websites[req.params.id]);
});

app.delete("/api/website/:id", function (req, resp) {
    websites.splice(req.params.id,1);
    resp.json(websites);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);