const mongoose = require('mongoose');
const logSchema = require('../schemas/log_schema');
module.exports = mongoose.model('Log', logSchema);