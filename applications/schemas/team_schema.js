const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
    name: String,
    remark: String,
    own:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    item: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    permissions: String,
    delete: Boolean,
    sync: Boolean,
    create: String
})