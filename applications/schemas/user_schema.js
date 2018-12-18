const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
	name: String,
	password: String,
	email: String,
	avatar: String,
	phone: String,
	github: String,
	salt: String,
	delete: Boolean,
	sync: Boolean,
	create: Date
})