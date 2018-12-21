const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    name: String,
    serial_number: String,  // 序列号
    title: String,
    content: String,
    type: Number,   // 1：添加仓库，2：添加模块，3：添加接口，4：创建团队，5：设置成员权限
    delete: Boolean,
    sync: Boolean,
    create: String
})