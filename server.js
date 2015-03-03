var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('hello world');
});

var websites = [
    { name: "Site1" }, { name: "Site2" }, { name: "Site3" }, { name: "Site4" }
];

app.get("/api/website", function (req, resp) {
    resp.json(websites);
});


app.get("/api/website/:id", function (req, resp) {
    resp.json(websites[req.params.id]);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);