const mongoose = require('mongoose');
const itemSchema = require('../schemas/item_schema');
module.exports = mongoose.model('Item', itemSchema);