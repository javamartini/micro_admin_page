const express = require('express'); //requesting resources
const cors = require('cors'); //cross-origin resource sharing for security
const path = require('path');	//for navigating the filepath
const sqlite3 = require('sqlite3'); //for accessing sqlite3 database
const {v4: uuidv4, validate} = require('uuid')
const bcryptjs = require('bcryptjs');	//for hashing passwords

const HTTPS_PORT = 8080;	//listening port

//db setup
const dbSource = "db/micro_admin.db";
const db = new sqlite3.Database(dbSource)

//salt hash setup
const intSaltRounds = 10;

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));	//for providing static content (JS, CSS, images, etc.)

//specifying port for the server to listen on
app.listen(HTTPS_PORT, () => {
	console.log("APP LISTENING ON:", HTTPS_PORT)
})

//serving login and registration content
app.get('/login', (request, response) => {
	response.sendFile(path.join(__dirname, 'public/html/login.html'));
})

app.get('/registration', (request, response) => {
	response.sendFile(path.join(__dirname, 'public/html/registration.html'));
})

// app.get('/', (request, response) => {
// 	let comSelect = "SELECT * FROM tblSessions WHERE user_email = ?"
// 	db.get(comSelect, [strEmail], (error, result) => {
// 		//if there is no session_id, create one
// 		if (error) {
// 			console.log("NO SESSION IDENTIFIER FOUND. CREATE ONE BY LOGGING IN", error);
//
// 			//logging in will allow us to create a session identifier
// 			app.get('/', (request, result) => {
// 				let strEmail = request.body.email;
// 				let strPassword = request.body.password;
// 				strPassword = bcryptjs.hashSync(strPassword, intSaltRounds);
//
// 				comSelect = "SELECT * FROM tblUsers WHERE email = ? AND password = ?"
// 				let arrParameters = [strEmail, strPassword];
// 				db.get(comSelect, arrParameters, function(error, result) {
//
// 				})
// 			})
//
// 			let comInsert = "INSERT INTO tblSessions VALUES (?, ?, ?, ?)";
// 			let strFutureDate = new Date(Date.now() + (12 * 60 * 60 * 1000));
// 			let arrParameters = [uuidv4(), strEmail, new Date(), strFutureDate];
// 			db.run(comInsert, arrParameters, (error, result) => {
// 				//if there is an error, return error JSON
// 				if (error) {
// 					console.error(error);
// 					return result.status(400).json({
// 						status: "ERROR INSERTING SESSION IDENTIFIER",
// 						exists: false
// 					});
// 					//else, return JSON regarding success creating the session identifier
// 				} else {
// 					response.status(401).json({
// 						status: "ACCESS DENIED",
// 						message: "INVALID CREDENTIALS"
// 					});
// 				}
// 			});
// 			//else, return JSON regarding session identifier already exists
// 		} else {
// 			//if the session identifier exists, then redirect the user to the status page
// 			if (result.exists) {
// 				response.redirect('public/html/status.html');
// 				//else, return JSON explaining the access is denied
// 			} else {
// 				response.status(401).json({
// 					status: "ACCESS DENIED",
// 					message: "I'm not sure how you even got here??? " +
// 						"I expect this else statement to remain unreachable."
// 				});
// 			}
// 		}
// 	})
// })

//function to validate the body of the request, preventing malicious API attacks
// function validateBody(requiredFields) {
// 	const validateLoginInput = (request, response, next) => {
// 		//if the request body is empty, return an error
// 		if (!request.body) {
// 			return response.status(400).json({
// 				error: "REQUEST BODY IS EMPTY"
// 			});
// 		}
//
// 		//will iterate through the required fields and check if they exist in the request body
// 		for (const field of requiredFields) {
// 			if (!request.body[field]) {
// 				return response.status(400).json({
// 					error: `FIELD '${field}' IS REQUIRED`
// 				});
// 			}
// 		}
//
// 		next(); //pass to the next handler
// 	}
//
// 	//log the time of request
// 	const logRequest = (request, response, next) => {
// 		console.log("REQUEST RECIEVED AT:", new Date());
// 		next(); //pass to the next handler
// 	}
// }