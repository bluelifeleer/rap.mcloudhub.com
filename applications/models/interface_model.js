const mongoose = require('mongoose');
const interfaceSchema = require('../schemas/interface_schema');
module.exports = mongoose.model('Interface', interfaceSchema);