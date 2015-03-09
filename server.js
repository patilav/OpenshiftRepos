var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cs5610');

var FormSchema = new mongoose.Schema({
    name: String,
    created: { type: Date, default: Date.now },
}, { collection: "form" });
var Form = mongoose.model("Form", FormSchema);

app.get("/api/form", function (req, resp) {
    Form.find(function receiveData(err, data) {
        resp.json(data);
    })
});

app.get("/api/form/:id", function (req, resp) {
    Form.findById(req.params.id, function receiveData(err, data) {
        resp.json(data);
    })
});

app.delete("/api/form/:id", function (req, resp) {
    Form.remove({ _id: req.params.id }, function (err, count) {
        console.log(err);
        console.log(count);
        Form.find(function receiveData(err, data) {
            resp.json(data);
        })
    })
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(express.static(__dirname + '/public'));

app.get('/content', function (req, res) {
    res.send('<h1>Hello from Open Shift - Static Message</h1>');
});

var websites = [
    {
        name: "Site1", pages: [
         {
             name: "Page 1, 1", widgets:
             [
                 { name: "Widget 1, 1, 1" },
                 { name: "Widget 1, 1, 2" },
                 { name: "Widget 1, 1, 3" },
             ]
         }
        ]
    },
    {
        name: "Site2", pages: [
         {
             name: "Page 1, 2", widgets:
             [
                 { name: "Widget 2, 1, 1" },
                 { name: "Widget 2, 1, 2" },
                 { name: "Widget 2, 1, 3" },
             ]
         }
        ]
    },
    {
        name: "Site3", pages: [
        {
            name: "Page 1, 3", widgets:
               [
           { name: "Widget 3, 1, 1" },
           { name: "Widget 3, 1, 2" },
           { name: "Widget 3, 1, 3" },
               ]
        }
        ]
    },
    {
        name: "Site4", pages: [
         {
             name: "Page 1, 4", widgets: [ ]
         }
        ]
    }
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
    websites.splice(req.params.id, 1);
    resp.json(websites);
});

app.delete("/api/website/:siteId/page/:pageIndex", function (req, resp) {
    websites[req.params.siteId].pages.splice(req.params.pageIndex, 1);
    resp.json(websites);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);