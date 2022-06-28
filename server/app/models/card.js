const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema({
	RFID: {
		type: String,  
	}, 
	score: {
		type: Number, 
	}
})

module.exports = mongoose.model("card", cardSchema)
