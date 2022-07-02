const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
	ID: Number, 
	name: String, 
	history: [{
		RFID: String, 
		score: Number, 
		timestamp: String, 
	}], 
	score: Number, 
})

module.exports = mongoose.model("team", teamSchema)
