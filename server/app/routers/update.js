const express = require("express");
const mongoose = require("mongoose");

// import mongoose schemas

const Team = require("../models/team");
const Card = require("../models/card");

mongoose.connect("mongodb://localhost:27017/wind");

function timeShift(timestamp) {
    let date = new Date(timestamp);
    date.setTime(date.getTime() + 20 * 60 * 60 * 1000);
    timestamp = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return timestamp;
}

const router = express.Router()
router.post("/update", async (req, res) => {
	console.log(req.body);
	ID = req.body.ID;
	RFID = req.body.RFID;

	let card = await Card.findOne({ RFID: RFID });

	const teams = await Team.where("ID").equals(ID);
	const team = teams.length >= 0 ? teams[0] : null;

	if (!team) {
		res.status(203).json({ result: "Unexpected error" });
		console.log("Unexpected error");
		return;
	}
	
	if (card) {
		for (const record of team.history) {
			if (record.RFID === RFID) {
				res.status(201).json({ result: "Card already detected" });
				console.log("Card already detected");
				return;
			}
		}
		team.history.push({
			RFID: card.RFID, 
			score: card.score, 
			timestamp: timeShift(new Date()), 
		});
		team.score += card.score;

		team.save().then((team) => {
			res.status(200).json({ result: "Get points" })
			console.log("Get points")
		});
	}
	else {
		card = await Card.findOne({ RFID: "penalty" });

		team.history.push({
			RFID: card.RFID, 
			score: card.score, 
			timestamp: timeShift(new Date()), 
		})
		team.score += card.score;

		team.save().then((team) => {
			res.status(202).json({ result: "Card Not Found" });
			console.log("Get penalty");
		});
	}
});


module.exports = router;

