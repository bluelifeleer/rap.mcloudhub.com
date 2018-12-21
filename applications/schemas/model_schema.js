const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
    serial_number: String,  // 序列号
    itemid: String,
    name: String,
    remark: String,
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    },
    interfaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interface'
    }],
    delete: Boolean,
    sync: Boolean,
    create: String
})