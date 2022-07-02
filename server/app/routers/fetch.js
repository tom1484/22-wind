const express = require("express");
const mongoose = require("mongoose");

// import mongoose schemas
const Team = require("../models/team");
const Card = require("../models/card");

mongoose.connect("mongodb://localhost:27017/wind");

const router = express.Router();
router.post("/fetch", async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");

	const teams = await Team.find({});
	res.status(200).json({ result: teams });
});


module.exports = router;

