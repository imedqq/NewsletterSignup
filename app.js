const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
	res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;
	//console.log(firstName,lastName,email);

	var data = {
		members: [
		 {
		 	email_address: email,
		 	status: "subscribed",
		 	merge_fields: {
		 		FNAME: firstName,
		 		LNAME: lastName
		 	}
		 }
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us6.api.mailchimp.com/3.0/lists/4b477a0ad6";

	const options = {
		method: "POST",
		auth: "KK:5ee16b80682c7db05e89d7388141482b-us6"
	}

	const request = https.request(url, options, function(response){
		console.log(response.statusCode);
		if (response.statusCode === 200) {
		//if (response.error_count === 0) {
			//res.send("Successfully sucscribed!");
			res.sendFile(__dirname + "/success.html");
		}else{
			//res.send("There was an error with signing up, please try again!");
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data){
			console.log(JSON.parse(data));
		})
	})

	request.write(jsonData);
	request.end();


})

app.post("/failure", function(req,res){
	res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){ //process.env.PORT heroku
	console.log("started listening on port 3000");
})

// mailchimp api key
// 5ee16b80682c7db05e89d7388141482b-us6
// list
// 4b477a0ad6

// ISSUE: ctrl+c doesnt stop running express server on hyperjs
// https://stackoverflow.com/questions/44788982/node-js-ctrl-c-doesnt-stop-server-after-starting-server-with-npm-start
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(1);
});