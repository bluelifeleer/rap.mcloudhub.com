const mongoose = require('mongoose');
const logsSchema = require('../schemas/logs_schema');
module.exports = mongoose.model('Logs', logsSchema);