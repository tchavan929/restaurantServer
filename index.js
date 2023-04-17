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
//app.use(bodyParser.urlencoded({'extended':'true'}));  
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');  
app.use(cors());

//const HBS= exphbs.create({ extname: '.hbs',defaultLayout:"main",layoutsDir:path.join(__dirname,'views','layouts')});
//app.engine('.hbs', HBS.engine);
//app.set('view engine', 'hbs');
var Movie = require('./models/movie');
var User = require('./models/user');
var Restaurant = require('./models/restaurant');
var RestaurantMenu = require('./models/restaurantMenu');
/*
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from access-control-allow-origin
	res.header("Access-Control-Allow-Headers", "*");
	next();
  });*/
app.all("/register",  async(req, res) => {
console.log("calling register method")
	try{
		// Get user input
		const { name, email, password } = req.body;
		console.log(email)
		console.log(password)
		// Validate user input
		if (!(email && password )) {
			res.status(400).send("All input is required");
		}
		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await User.findOne({ email });
		console.log("Checking if older user")
		console.log(oldUser)
		if (oldUser){
			return res.status(409).send("User Already Exist. Please Login");
		}
		//Encrypt user password
		encryptedPassword = await bcrypt.hash(password, 10);
		// Create user in our database
		console.log(encryptedPassword+"encryptedPassword")
		const user = await User.create({email: email.toLowerCase(),password: encryptedPassword,});
		// Create token
		const token = jwt.sign(
			{ user_id: user._id,email },
			process.env.TOKEN_KEY,
			{expiresIn: "2h",});
		user.token = token;
		// return new user
		console.log("returning new user ")
		res.status(201).json(user);
	} catch (err) {
		console.error(err);
	}
});

app.post("/login", async (req, res) => {
console.log(req)
	console.log("req.body",req.body)
	console.log("req.query",req.query)
	console.log("req.params",req.params)
	
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
			console.log("empty hai ")
			res.status(400).send("All input is required");
		}
		const user = await User.findOne({ email });
		//console.log(user)
		if (user) {
			bcrypt.compare(password, user.password, function(err, respass) {
				console.log("let see the result")
				if (respass) {
					const token = jwt.sign({ user_id: user._id, email },
						process.env.TOKEN_KEY,
						{expiresIn: "2h",});
						user.token = token;
						res.status(200).json(user);
				}else{
					res.status(400).send("Invalid Credentials");
				}

			})
			
		}else{
			console.log("user not found")
			res.status(401).send("Invalid Credentials");}
			
		} catch (err) {
			//console.error(err);
			console.error("error occured hereeee")
		}
	});

	app.get("/fetchRestaurantList", async (req, res) => {
		database.getAllRestaurants().then((result) => {
			console.log(result)
			res.send(result)
		}).catch((error) => {
			console.error(error)
			res(error)
		});

	});
  
	app.get("/fetchRestaurantMenu/:id", async (req, res) => {
		let id = req.params.id;
		console.log(id)
		database.getRestaurantsMenu(id).then((result) => {
			console.log(result)
			res.send(result)
		}).catch((error) => {
			console.error(error)
			res(error)
		});

	});
	app.get("/fetchedUserDetails/:email", async (req, res) => {
		let email = req.params.email;
		console.log(" check emial here "+email);
		const oldUser = await User.findOne({ email });
		res.send(oldUser);
		/*database.getUserDetails(email).then((result) => {
			console.log(result)
			res.send(result)
		}).catch((error) => {
			console.error(error)
			res(error)
		});*/

	});
	app.post("/updateUser/", async (req, res) => {
	/*	let email = req.params.email;
		console.log(" check emial here "+email);
		const oldUser = await User.findOne({ email });
		res.send(oldUser);*/
		const filter = { email: req.body.email };
		const update = { name: req.body.name };
		console.log("updateUser")
		console.log(req.params)
		console.log(req.body)
		console.log(filter)
		await User.findOneAndUpdate(filter, update);
		res.send("test");
		

	});
	app.get("/getImages/:id", async (req, res) => {
		id=req.params.id
		console.log(id);
		var img = fs.readFileSync(path.join(__dirname,'public','images',id+".png"));
		res.writeHead(200, {'Content-Type': 'image/png' });
		res.end(img, 'binary');

	});
/* */
app.get('*', function(req, res) {
	//res.render('error', { title: 'Error', message:'Wrong Route' });	
	res.send('Wrong Route');
	});
	app.listen(port);
	console.log("App listening on port : " + port);
	