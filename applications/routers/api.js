'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const Mock = require('mockjs')
const User = require('../models/user_model');
const Item = require('../models/item_model');
const Model = require('../models/model_model');
const Interface = require('../models/interface_model');
const Log = require('../models/logs_model');
const MyDate = new Date();

let output = {};

router.use(function(req, res, next) {
    output = {
        code: 0,
        msg: '',
        ok: false,
        data: null
    };
    next();
});

router.get('/verify', (req, res, next)=>{
	let captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

router.post('/user/login', (req, res, next)=>{
    let checked = req.body.checked;
    let name = req.body.name;
    let password = req.body.password;
    let verify = req.body.verify;
    User.findOne({ name: name }).then(user=>{
        // console.log(user)
        if(user){
            if(md5(password+user.salt) == user.password){
                if(checked){
                    req.session.uid = user._id;
                    res.cookie('uid', user._id, { maxAge: 1000 * 3600 * 10, expires: 1000 * 3600 * 10 });
                    res.cookie('checked', checked, { maxAge: 1000 * 3600 * 10, expires: 1000 * 3600 * 10 });
                    res.cookie('name', user.name, { maxAge: 1000 * 3600 * 10, expires: 1000 * 3600 * 10 });
                    res.cookie('password', user.password, { maxAge: 1000 * 3600 * 10, expires: 1000 * 3600 * 10 });
                    output = {
                        code: 1,
                        msg: 'success',
                        ok: true,
                        data: null
                    };
                    res.json(output);
                    return false;
                }
            }
        }else{
            output = {
                code: 0,
                msg: '无此用户',
                ok: false,
                data: null
            };
            res.json(output);
            return false;
        }
    }).catch(err=>{
        console.log(err)
        output = {
            code: 0,
            msg: 'error',
            ok: false,
            data: null
        };
        res.json(output);
        return false;
    })
});

router.post('/user/register', (req, res, next)=>{
    // console.log(req.body)
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let salt = MyDate.getTime();
    User.findOne({ name: name }).then(user=>{
        if(user._id){
            output = {
                code: 0,
                msg: '此用户已注册',
                ok: false,
                data: null
            };
            res.json(output);
            return false;
        }else{
            new User({
                name: name,
                password: md5(password+salt),
                email: email,
                salt: salt,
                delete: false,
                sync: false,
                create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
            }).save().then(reg=>{
                if(reg._id){
                    // 添加默认仓库
                    new Item({
                        uid: reg._id,
                        name: 'example',
                        remark: 'example',
                        icon: '',
                        repository: '',
                        url: 'www.example.com',
                        own: reg,
                        permissions: 'public',
                        members: [reg],
                        delete: false,
                        sync: false,
                        create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                    }).save().then(item=>{
                        output = {
                            code: 1,
                            msg: '注册成功',
                            ok: true,
                            data: null
                        };
                        res.json(output);
                        return false;
                    }).catch(err=>{
                        console.log(err)
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/item/add', (req, res, next) =>{
    let name = req.body.name || '';
    let remark = req.body.remark || '';
    let icon = req.body.icon || '';
    let repository = req.body.repository || '';
    let url = req.body.url || '';
    let permissions = req.body.permissions || '';
    User.findOne({_id:'5c0fef108a2076086a4c4dce'}).then(user=>{
        new Item({
            uid: user._id,
            name: name,
            remark: remark,
            icon: icon,
            repository: repository,
            permissions: permissions,
            members: [user],
            url: url,
            own: user,
            delete: false,
            sync: false,
            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
        }).save().then(item=>{
            if(item){
                output = {
                    code: 1,
                    msg: 'success',
                    ok: true,
                    data: {
                        item: {
                            id: item._id
                        }
                    }
                };
                res.json(output);
                return false;
            }else{
                output = {
                    code: 0,
                    msg: 'error',
                    ok: false,
                    data: null
                };
                res.json(output);
                return false;
            }
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
});

router.get('/item/lists', (req, res, next) => {
    let uid = req.query.uid || req.session.uid;
    Item.find({uid: uid}).populate([
        {
            path:'own',
            select:'name'
        }
    ]).then(items=>{
        if(items){
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    items: items
                }
            };
            res.json(output);
            return false;
        }
    }).catch(err=>{
        console.log(err)
    })
});

router.get('/item/get', (req, res, next) => {
    let id = req.query.id;
    Item.findById(id).populate([
        {
            path:'own',
            select:'name'
        },
        {
            path: 'models',
            select: 'name remark',
            populate:{
                path: 'interfaces',
                select: 'name request fields response'
            }
        },
        {
            path: 'members',
            select: 'name avarat email'
        }
    ]).then(item=>{
        if(item){
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    item: item
                }
            };
            res.json(output);
            return false;
        }
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/model/add', (req, res, next) => {
    let uid = req.body.uid || req.session.uid;
    let item_id = req.body.item_id;
    let name = req.body.name;
    let remark = req.body.remark;
    Item.findById(item_id).then(item=>{
        return Promise.all([item]);
    }).spread((item)=>{
        new Model({
            uid: uid,
            itemid: item._id,
            name: name,
            remark: remark,
            item: item,
            delete: false,
            sync: false,
            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
        }).save().then(model=>{
            item.models.push(model);
            item.save();
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    model: model._id
                }
            };
            res.json(output);
            return false;
        }).catch(err=>{
            console.log(err)
        })
    })
});

router.post('/interface/add', (req, res, next)=>{
    let uid = req.body.uid || req.session.uid;
    let item_id = req.body.item_id;
    let model_id = req.body.model_id;
    let name = req.body.name;
    let remark = req.body.remark;
    let request = req.body.request;
    let fields = [{
        name: "test",
        remark: "test",
        type: "string",
        default: "",
        indispensable: false
    }];
    let response = [{
        name: "test",
        remark: "test",
        type: "string",
        default: "",
        indispensable: false
    }];
    Item.findById(item_id).then(item=>{
        let user = User.findById(uid);
        let model = Model.findById(model_id);
        return Promise.all([user, model, model]);
    }).spread((user,item,model)=>{
        new Interface({
            uid: user._id,
            itemid: item_id,
            modelid:model_id,
            name: name,
            remark: remark,
            item: item,
            model: model,
            request: request,
            fields: fields,
            response: response,
            delete: false,
            sync: false,
            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
        }).save().then(add=>{
            model.interfaces.push(add);
            model.save();
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    interface: add._id
                }
            };
            res.json(output);
            return false;
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/interface/editor', (req, res, next)=>{
    let type = req.body.type;
    let data = req.body.data;
    Interface.findById(data.id).then(result=>{
        if(result){
            if(type == "request"){
                result.fields.push({
                    name: data.name,
                    remark: data.remark,
                    type: data.type,
                    default: data.default,
                    indispensable: data.indispensable
                })
            }else{
                result.response.push({
                    name: data.name,
                    remark: data.remark,
                    type: data.type,
                    default: data.default,
                    indispensable: data.indispensable
                })
            }
            result.save().then(s=>{
                output = {
                    code: 1,
                    msg: 'success',
                    ok: true,
                    data: null
                };
                res.json(output);
                return false;
            }).catch(err=>{
                console.log(err)
            })
        }
    }).catch(err=>{
        console.log(err)
    });
})

module.exports = router;