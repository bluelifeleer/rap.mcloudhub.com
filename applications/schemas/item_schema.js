const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    uid: String,
    name: String,
    remark: String,
    icon: String,
    repository: String,
    url: String,
    models: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Model',
        }
    ],
    own:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    permissions: String, // public,privatye
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    delete: Boolean,
    sync: Boolean,
    create: String
})