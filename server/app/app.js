const express = require("express");
const readline = require("readline");

const app = express();
// allow parsing json object

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://140.112.174.222:6987');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
})

app.use(express.json());
app.use("/wind", require("./routers/update"));
app.use("/wind", require("./routers/fetch"));

var server = app.listen(9487);

// console.log("RUNING...");

// process.on('SIGINT', function() {
// 	console.log("CLOSING");
//     server.close(() => {
// 		console.log("CLOSED");
// 		process.exit();
// 	})
// });

// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
// console.log("PRESS q TO EXIT");

// process.stdin.on('keypress', (str, key) => {
// 	if (key.name === "q" || key.name === "Q") {
// 		// console.log(key.name);
// 		server.close(() => {
// 			console.log("CLOSE");
// 			process.exit();
// 		})
// 	}
// })

