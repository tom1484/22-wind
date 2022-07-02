const express = require("express")

const app = express()
// allow parsing json object
app.use(express.json())

var router = express.Router()
router.get('/update', function (req, res) {
    console.log(req.body)
    res.send("Hi");
})

app.use("/wind", router)

var server = app.listen(9487)

