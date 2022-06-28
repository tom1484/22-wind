const express = require("express")
const mongoose = require("mongoose")

// import mongoose schemas
const Team = require("../models/team")
const Card = require("../models/card")

mongoose.connect("mongodb://localhost:27017/wind")

const router = express.Router()
router.post("/update", async (req, res) => {
	try {
		console.log(req.body)
		ID = req.body.ID
		RFID = req.body.RFID

		Card.findOne({ RFID: RFID }).then((card) => {
			if (card) {
				Team.findOne({ ID: ID }).then((team) => {
					team.history.push({
						score: card.score, 
						timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), 
					})
					team.score += card.score

					team.save().then((team) => {
						res.status(200).json({ result: "Update Successfully" })
					})
				})
			}
			else {
				res.status(201).json({ result: "Card Not Found" })
			}
		})
	}
	catch (e) {
		res.status(202).json({ result: "Invalid Request" })

	}
})


module.exports = router

