const mongoose = require('mongoose');
const teamSchema = require('../schemas/team_schema');
module.exports = mongoose.model('Team', teamSchema);