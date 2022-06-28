// const readline = require("readline")
const fs = require("fs")

const express = require("express")
const mongoose = require("mongoose")

const Card = require("./models/card")


mongoose.connect("mongodb://localhost:27017/wind")


Card.deleteMany({}).then((err) => {

	const data = fs.readFileSync("app/cards.txt", "utf8")
	const lines = data.split("\n")

	var total = 0
	var saved = 0
	for (const line of lines) {
		const arr = line.split(",")
		if (arr.length != 2) {
			return
		}
		const RFID = arr[0]
		const score = parseInt(arr[1])

		total++
		const card = new Card({ RFID: RFID, score: score })
		card.save().then((card) => {
			// console.log(card)
			if (++saved == total) {
				process.exit()
			}
		})
	}
})



