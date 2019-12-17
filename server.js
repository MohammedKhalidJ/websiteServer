// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
const path = require('path');
 
// Configuration
mongoose.connect('mongodb+srv://user123:user123@cluster0-puaop.mongodb.net/test?retryWrites=true&w=majority');
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
 
// Models
var JobSeeker = mongoose.model('JobSeeker', {
    name: String,
    email: String,
    resume: String,
    contactNo: Number,
});
 
// Routes
 
    // Get reviews
    app.get('/api/getResumes', function(req, res) {
 
        console.log("fetching resumes");
 
        // use mongoose to get all reviews in the database
        JobSeeker.find(function(err, custmrDatas) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(custmrDatas); // return all reviews in JSON format
        });
    });
 
    // create review and send back all reviews after creation
    app.post('/api/addResume', function(req, res) {
 
        console.log("creating review");
 
        // create a review, information comes from request from Ionic
        JobSeeker.create({
            name : req.body.title,
            email : req.body.description,
            contactNo : req.body.contactNo,
            resume: req.body.resume
        }, function(err, review) {
            if (err)
                res.send(err);
 
            // get and return all the reviews after you create another
            JobSeeker.find(function(err, custmrDatas) {
                if (err)
                    res.send(err)
                res.json(custmrDatas);
            });
        });
 
    });
 
 
 
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
