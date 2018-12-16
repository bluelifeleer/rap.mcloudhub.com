const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
    itemid: String,
    modelid:String,
    name: String,
    remark: String,
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    },
    model:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
    },
    request: {},
    fields: Array,
    response: Array,
    delete: Boolean,
    sync: Boolean,
    create: Date
})