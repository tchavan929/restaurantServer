
var express  = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser'); 
const exphbs = require('express-handlebars');
var fs = require('fs');  
const auth = require("./middleware/auth");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var port     = process.env.PORT || 8000;


database.initialize(process.env.DBURL||database.url);
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
//app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, 'public')));

const HBS= exphbs.create({ extname: '.hbs',defaultLayout:"main",layoutsDir:path.join(__dirname,'views','layouts')});
app.engine('.hbs', HBS.engine);
app.set('view engine', 'hbs');
var Movie = require('./models/movie');
var User = require('./models/user');

const { json } = require('express');

/* */
/*
app.post("/register", async (req, res) => {
	try{
		// Get user input
		const { name, email, password } = req.body;
		// Validate user input
		if (!(email && password && name)) {
			res.status(400).send("All input is required");
		}
		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await User.findOne({ email });
		console.log(oldUser)
		if (oldUser){
			return res.status(409).send("User Already Exist. Please Login");
		}
		//Encrypt user password
		encryptedPassword = await bcrypt.hash(password, 10);
		// Create user in our database
		const user = await User.create({name,email: email.toLowerCase(),password: encryptedPassword,});
		// Create token
		const token = jwt.sign(
			{ user_id: user._id,email },
			process.env.TOKEN_KEY,
			{expiresIn: "2h",});
		user.token = token;
		// return new user
		res.status(201).json(user);
	} catch (err) {
		console.log(err);
	}
});
*/
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
			res.status(400).send("All input is required");
		}
		const user = await User.findOne({ email });
		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign({ user_id: user._id, email },
				process.env.TOKEN_KEY,
				{expiresIn: "2h",});
				user.token = token;
				res.status(200).json(user);
			}
			res.status(400).send("Invalid Credentials");
		} catch (err) {
			console.log(err);
		}
	});
  
/* 
app.get('/api/movies/getlist/view', auth,function(req, res) {
	//res.render('showdata', { obj: obj});
	let page_p = req.query.page;
    let perPage_p = req.query.perPage;
    let title_p = req.query.title;
	console.log(req.query);	

	database.getAllMovies(page_p,perPage_p,title_p).then((result) => {
		console.log("inside app"+result[0])
		console.log(typeof(result))
		//let text = result.replace("_id", "id");
		resultm=JSON.stringify(result);
		//delete resultm[0]._id;
		console.log("resultm"+typeof(resultm))
		g=JSON.parse(resultm)
		console.log("resultm"+typeof(g))

		//resultJson=JSON.parse(result);
		//console.log("json result"+resultJson);
		res.render('showdata', { obj: g  });
	})
	.catch((error) => {
		console.error("inside app"+error)
		res(error)
	});;
});

app.get('/api/Movies/:id', auth,function(req, res) {
	console.log("Inside app.get('/api/Movies/:id')")
	let id = req.params.id;
	console.log("Waiting for promise ");
	//var hh=database.getMovieById(id);
	database.getMovieById(id).then((result) => {
		console.log(result)
		res.send(result)
	})
	.catch((error) => {
		console.error(error)
		res(error)
	});
});

app.get('/api/movies/', auth,function(req, res) {
	let page_p = req.query.page;
    let perPage_p = req.query.perPage;
    let title_p = req.query.title;
	console.log(req.query);	

	database.getAllMovies(page_p,perPage_p,title_p).then((result) => {
		console.log("inside app"+result)
		res.send(result)
	})
	.catch((error) => {
		console.error("inside app"+error)
		res(error)
	});;
	
});
app.post('/api/Movies/', auth, function(req, res) {

	console.log(req.query);
	console.log(req.params);
	var data={
		title:req.query.title,
		fullplot:req.query.fullplot	
	};
	console.log("check data idar "+data);
	var flag=database.addNewMovie(data).then((result) => {
		console.log("flag result"+result)
		console.log(typeof(result))
		if(flag){
			res.send("data inserted")
		}else{
			res.send("something went wrong");
		}
		
	})
	.catch((error) => {
		console.error("inside app"+error)
		res(error)
	});
});
app.put('/api/Movies/:id', auth, function(req, res) {
	let id = req.params.id;
	console.log("Waiting for promise ");
	//var hh=database.getMovieById(id);
	database.getMovieById(id).then((result) => {
		console.log(result)
		res.send(result)
	})
	.catch((error) => {
		console.error(error)
		res(error)
	});
});*/
/*
app.delete('/api/Movies/',  auth,function(req, res) {
	let id = req.query.id;
	console.log("Waiting for promise ");
	//var hh=database.getMovieById(id);
	database.deleteMovieById(id).then((result) => {
		console.log(result)
		res.send(result)
	})
	.catch((error) => {
		console.error(error)
		res(error)
	});
});*/
/*
app.get('*', function(req, res) {
res.render('error', { title: 'Error', message:'Wrong Route' });	
});
app.listen(port);
console.log("App listening on port : " + port);
*/