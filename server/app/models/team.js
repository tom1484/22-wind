const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
	ID: Number, 
	history: [{
		score: Number, 
		timestamp: String, 
	}], 
	score: Number, 
})

module.exports = mongoose.model("team", teamSchema)
