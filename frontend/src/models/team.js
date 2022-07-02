const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
	ID: Number, 
	history: [{
		RFID: String, 
		score: Number, 
		timestamp: String, 
	}], 
	score: Number, 
})

module.exports = mongoose.model("team", teamSchema)
