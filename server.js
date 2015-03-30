var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(express.bodyParser({ limit: '50mb' })); //save images

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';
mongoose.connect(connectionString);

//app.get('/process', function (req, res) {
//    res.json(process.env);
//})

var PageSchema = new mongoose.Schema({
    name: String,
    created: {type: Date, default: Date.now}
});

var WebSiteSchema = new mongoose.Schema({
    name: String,
    pages: [PageSchema]
}, { collection: "website" });


var WebsiteModel = mongoose.model("WebsiteModel", WebSiteSchema);

var FormSchema = new mongoose.Schema({
    name: String,
    created: { type: Date, default: Date.now }
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
             name: "Page 1, 4", widgets: []
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
//---------------------------------------------------------------------------------------------------

app.get("/mongoapi/website", function (req, resp) {
    WebsiteModel.find(function (err, data) {
        resp.json(data);
    });
});

app.post("/mongoapi/website", function (req, resp) {
    var site1 = new WebsiteModel(req.body);
    site1.save(function (err, doc) {
        WebsiteModel.find(function (err, data) {
            resp.json(data);
        });
    });
});

app.get("/mongoapi/website/:id", function (req, resp) {
    WebsiteModel.findById(req.params.id, function (err, doc) {
        resp.json(doc);
    })
});

app.delete("/mongoapi/website/:id", function (req, resp) {
    WebsiteModel.findById(req.params.id, function (err, doc) {
        doc.remove();
        WebsiteModel.find(function (err, data) {
            resp.json(data);
        });

    });
});

app.delete("/mongoapi/website/:siteId/page/:pageIndex", function (req, resp) {
    websites[req.params.siteId].pages.splice(req.params.pageIndex, 1);
    resp.json(websites);
});

app.get("/mongoapi/website/:siteId/page", function (req, resp) {
    WebsiteModel.findById(req.params.siteId, function (err, doc) {
        resp.json(doc.pages);
    })
});

app.put("/mongoapi/website/:id", function (req, res) {
    WebsiteModel.update({ _id: req.params.id }, { $set: req.body }, function (err, data) {
        WebsiteModel.find(function (err, data) {
            res.json(data);
        });
    });
})

//--------------------Schemas--------------------------------------------------------


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    photo: String
}, { collection: 'user' });

var commentSchema = new mongoose.Schema({
    username: String,
    text: String
}, { collection: 'comment' });

var userModel = mongoose.model("UserModel", userSchema);
var commentModel = mongoose.model("CommentModel", commentSchema);

//-----------------------------mongo 00-comment ---------------------------------------


app.get('/mongodb/000-comment', function (req, res) {
    commentModel.find(function (err, data) {
        res.json(data);
    });
});

app.post('/mongodb/000-comment', function (req, res) {
    var comment = new commentModel(req.body);
    comment.save(function () {
        commentModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.post('/mongodb/000-update', function (req, res) {
    var username = req.body.username;
    userModel.update({ username: username }, { $set: req.body }, function (err, data) {
        userModel.find(function (err, data) {
            res.json(data);
        });
    });
});

app.post('/mongodb/000-login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    userModel.find({ username: username, password: password }, function (err, data) {
        res.json(data);
    });
});

//---------------------mongodb/002-signupsave-------------------------------------------

app.post('/mongodb/002-signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var photo = req.body.photo;

    userModel.find({ username: username }, function (err, data) {
        if (data.length > 0) {
            res.json({ response: 'false' });
        } else {
            new userModel({
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                photo: photo
            }).save(function (err, data) {
                res.json({ response: 'true' });
            });
        }
    });

});

//-----------------------004-comment----------------------------------------------------/

var users = [
        { username: "avanti", password: "avanti", email: "patil.av@husky.neu.edu", firstName: "Avanti", lastName: "Patil", photo: "" },
        { username: "root", password: "root", email: "root@husky.neu.edu", firstName: "Root", lastName: "Admin", photo: "" },
        { username: "admin", password: "admin", email: "admin@husky.neu.edu", firstName: "Admin", lastName: "Root", photo: "" }
];

var comments = [{ username: "avanti", text: "First Comment" }];

app.get('/004-comment', function (req, res) {
    res.json(comments);
});

app.post('/004-comment', function (req, res) {
    comments.push(req.body);
    res.json(comments);
});

//---------------------------------002-save----------------------------------------

app.post('/002-update', function (req, res) {

    var user = req.body;
    var currentUser = null;

    for (var index in users) {
        if (users[index].username == user.username) {
            users[index].firstName = user.firstName;
            users[index].lastName = user.lastName;
            users[index].email = user.email;
            users[index].password = user.password;
            users[index].photo = user.photo;
            currentUser = users[index];
        }
    }

    res.json(currentUser);
});

//-----------------------------001-profile----------------------------------

app.post('/001-login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var currentUser = null;

    for (var index in users) {
        if (users[index].username == username && users[index].password == password) {
            currentUser = users[index];
        }
    }
    res.json(currentUser);
});

//----------------------------000-clientApp--------------------------------------

app.get('/', function (req, res) {
    res.send('Hello World');
});

var login = [
    {
        username: 'avanti', password: 'avanti', application: [
          { name: 'Word' },
          { name: 'Excel' },
          { name: 'Powerpoint' },
        ]
    },
    { username: 'admin', password: 'admin', application: [] },
    { username: 'root', password: 'root', application: [] }
];

app.get('/login', function (req, res) {
    res.json(login);
});

app.get('/login/:index', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    res.json(login[idx]);
});

app.post('/login', function (req, res) {
    var obj = req.body;
    login.push(obj);
    res.json(login);
});

app.put('/login/:index', function (req, res) {
    var index = req.params.index;
    login[index] = req.body;
    res.json(login);
});

app.delete('/login/:index', function (req, res) {
    var idx = req.params.index;
    login.splice(idx, 1);
    res.json(login);
});

app.get('/login/:index/application', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    res.json(login[idx].application);
});

app.get('/login/:index/application/:appIndex', function (req, res) {
    var idx = req.params.index; // or req.params['index'];
    var appIdx = req.params.appIndex;

    res.json(login[idx].application[appIdx]);
});

app.get('/bye', function (req, res) {
    res.send('Good Bye');
});

//---------------------------------------------------------------------------------------
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);