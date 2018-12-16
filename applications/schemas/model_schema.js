const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
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
    create: Date
})