const mongoose = require('mongoose');
const modelSchema = require('../schemas/model_schema');
module.exports = mongoose.model('Model', modelSchema);