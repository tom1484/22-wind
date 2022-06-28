const express = require("express")
const readline = require("readline")

const app = express()
// allow parsing json object
app.use(express.json())
app.use("/wind", require("./routers/update"))

var server = app.listen(1484)

//readline.emitKeypressEvents(process.stdin)
//process.stdin.setRawMode(true)
//console.log("PRESS q TO EXIT")

//process.stdin.on('keypress', (str, key) => {
//	if (key.name === "q" || key.name === "Q") {
//		server.close(() => {
//			console.log("CLOSE")
//			process.exit()
//		})
//	}
//})

