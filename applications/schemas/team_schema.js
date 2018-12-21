const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
    serial_number: String,  // 序列号
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