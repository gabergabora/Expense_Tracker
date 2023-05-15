const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 
// const { JSend } = require('jsend-express');
const session = require('express-session');
const app = express();

             
// Set Views folder Path
app.set('views',path.join(__dirname,'views'));

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// // Append Jsend Miidleware 
// const jSend = new JSend({ name: 'appName', version: 'X.X.X', release: 'XX' })
// app.use(jSend.middleware.bind(jSend))

// Set session
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))


app.get('/', function (req, res) {
    res.send('Welcome To the Expense Tracker API');
  })



require('./model/userModel');
require('./model/walletModel');
require('./model/expenseHistory');
require('./model/categoryModel');

mongoose.connect('mongodb://127.0.0.1:27017/expense_db',{useNewUrlParser:true},{useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection error'));
db.once('open', function(){
    console.log("Connected to the database")
});

const authController = require('./controller/authController.js');
const expenseController = require('./controller/expenseController.js');



app.post('/auth/login',authController.loginUser);
app.get('/user',authController.getUserProfile);
app.post('/auth/register',authController.registerUser);

//all Expense User
app.post('/addexpense',expenseController.addExpense);
app.get('/getallexpense',expenseController.getAllExpense);
app.get('/getallcategory',expenseController.getAllCategory);
app.get('/getallexpensetotal',expenseController.calculateCategoryTotal);

app.delete('/expense/:id',expenseController.deleteExpense);


const port = 3000 || process.env.port;
app.listen(port, ()=> console.log("Listening to Port: " + port));
