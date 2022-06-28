const express = require("express")
const mongoose = require("mongoose")

const Team = require("./models/team")

mongoose.connect("mongodb://localhost:27017/wind")


const N = 8

Team.deleteMany({}).then((err) => {
	var total = 0
	var saved = 0
	for (var i = 1; i <= N; i++) {
		total++
		const team = new Team({ ID: i, history: [], score: 0 })
		team.save().then((team) => {
			if (++saved == total) {
				process.exit()
			}
		})
	}

})
