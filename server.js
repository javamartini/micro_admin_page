const express = require("express"); //requesting resources
const cors = require("cors"); //cross-origin resource sharing for security
const path = require("path");	//for navigating the filepath
const sqlite3 = require("sqlite3"); //for accessing sqlite3 database
const {v4: uuidv4} = require("uuid");	//for creating unique ids
const jwt = require("jsonwebtoken"); //for session identifiers
const bcryptjs = require("bcryptjs");	//for hashing passwords
require("dotenv").config(); //for environment variables

//if there is no just environmental variable, exit the application, security feature
if (!process.env.JWT_SECRET) {
	console.error("JWT_SECRET is not set in environment variables");
	process.exit(1);
}

const HTTPS_PORT = 8080;	//listening port

//db setup
const dbSource = "db/micro_admin.db";
const db = new sqlite3.Database(dbSource);

//salt hash setup
const intSaltRounds = 10;

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));	//for providing static content (JS, CSS, images, etc.)

//specifying port for the server to listen on
app.listen(HTTPS_PORT, () => {
	console.log("APP LISTENING ON:", HTTPS_PORT);
});

//serving login content
app.get("/login", (request, response) => {
	response.sendFile(path.join(__dirname, "public/html/login.html"));
});

//logging into user account, data from login.js
app.post("/login", (request, response) => {
	let strEmail = request.body.email.trim().toLowerCase();
	let strPassword = request.body.password;
	const comSelect = "SELECT * FROM tblUsers WHERE email = ?";
	
	db.get(comSelect, [strEmail], function (error, result) {
		//handle database errors
		if (error) {
			console.error(error);
			return response.status(500).json({
				status: "Database Error",
				message: "An internal server error occurred."
			});
			//if the email was not found, tell the user
		} else if (!result) {
			return response.status(400).json({
				status: "Authentication Error",
				message: "This email was not found. Have you registered yet?"
			});
		}
		
		//if the email was found, compare the password
		bcryptjs.compare(strPassword, result.password, function (error, isMatch) {
			// if error, return server authentication error
			if (error) {
				return response.status(500).json({
					status: "Server Authentication Error",
					message: "An error occurred while authentication."
				});
				// else if the password is incorrect, return authentication error
			} else if (!isMatch) {
				return response.status(400).json({
					status: "Authentication Error!",
					message: "This password is incorrect. Please try again!"
				});
				//else, the password is correct, create a jwt token and return it
			} else {
				let strSessionID = uuidv4(); //create a session identifier
				//create a jwt token
				const strToken = jwt.sign({
						user_id: result.user_id,
						session_id: strSessionID
					},
					process.env.JWT_SECRET,
					{
						expiresIn: "12h"
					});
				
				return response.status(200).json({
					boolean: true,
					status: "Everything looks good!",
					message: "You should be redirected shortly!",
					jwt_token: strToken
				});
			}
		});
	});
});

//serving registration content
app.get("/registration", (request, response) => {
	response.sendFile(path.join(__dirname, "public/html/registration.html"));
});

//creating a user account, data from registration.js
app.post("/registration", (request, response) => {
	let strUserID = uuidv4();
	let strEmail = request.body.email.trim().toLowerCase();
	let strPassword = request.body.password;
	strPassword = bcryptjs.hashSync(strPassword, intSaltRounds); //hashing the password
	let strFirstName = request.body.first_name;
	let strLastName = request.body.last_name;
	
	const comInsert = "INSERT INTO tblUsers VALUES (?, ?, ?, ?, ?)";
	let arrParameters = [strUserID, strEmail, strFirstName, strLastName, strPassword];
	db.run(comInsert, arrParameters, function (error, result) {
		//if there is an error, output the error and return error JSON
		if (error) {
			console.error(error);
			return result.status(400).json({
				status: "There was an issue..",
				message: "The server is responding, but there was an error creating your account. Could it already exist?"
			});
			// else, create the user and bring them back to the login page
		} else {
			return response.status(201).json({
				boolean: true,
				status: "Success!",
				message: "Your account was successfully created!"
			});
		}
	});
});

app.get("/status", verifyToken, (request, response) => {
	response.status(200).sendFile(path.join(__dirname, "public/html/status.html"));
});

//middleware for authorizing the session identifier, finding the token in the request header, and verifying the token
function verifyToken(request, response, next) {
	//store the authorization header
	const authHeader = request.headers.authorization;
	console.log(authHeader);
	
	//if there is no authorization header, scream at the user with a disgusting amount of aggression
	if (!authHeader) {
		return response.status(400).json({
			message: "NO AUTHORIZATION HEADER FOUND"
		});
	}
	
	//else, split the authHeader and store the data we want
	let strToken = authHeader.split(" ")[1];
	
	//if thew strToken equals null, then redirect the user to login
	if (strToken === null) {
		return response.status(401).redirect("/login");
		//else, verify the token
	} else {
		jwt.verify(strToken, process.env.JWT_SECRET, (error, decoded) => {
			//if the token was wrong, redirect the user to login
			if (error) {
				return response.status(401).redirect("/login");
				//else, continue with the now decoded data
			} else {
				request.user = decoded;
				next();	//continue on
			}
		});
	}
}