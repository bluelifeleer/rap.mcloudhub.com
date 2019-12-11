/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:16:01
 * @Last Modified by:   thebu
 * @Last Modified time: 2019-12-11 10:39:36
 */
'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const utils = require('../../utils')
const User = require('../../models/user_model');
const Item = require('../../models/item_model');
const Model = require('../../models/model_model');
const Interface = require('../../models/interface_model');
const Team = require('../../models/team_model');
const Logs = require('../../models/logs_model');
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

router.post('/login', (req, res, next) => {
    let checked = req.body.checked;
    let name = req.body.name;
    let password = req.body.password;
    let verify = req.body.verify;
    let cookieChecked = req.body.cookieChecked;
    if (!cookieChecked) {
        if (verify.toLowerCase() != (req.session.verify ? req.session.verify.toLowerCase() : null)) {
            output = {
                code: 0,
                msg: '验证码输入错误',
                ok: false,
                data: null
            };
            res.json(output);
            return false;
        }
    }

    User.findOne({
        name: name
    }).then(user => {
        if (user) {
            if (md5(password + user.salt) == user.password) {
                if (checked) {
                    res.cookie('checked', checked, {
                        maxAge: 1000 * 3600 * 10,
                        expires: 1000 * 3600 * 10
                    });
                    res.cookie('password', password, {
                        maxAge: 1000 * 3600 * 10,
                        expires: 1000 * 3600 * 10
                    });
                }
                res.cookie('name', user.name, {
                    maxAge: 1000 * 3600 * 10,
                    expires: 1000 * 3600 * 10
                });
                res.cookie('uid', user._id, {
                    maxAge: 1000 * 3600 * 10,
                    expires: 1000 * 3600 * 10
                });
                req.session.uid = user._id;
                req.session.name = user.name;
                output = {
                    code: 1,
                    msg: 'success',
                    ok: true,
                    data: null
                };
                res.json(output);
                return false;
            } else {
                output = {
                    code: 0,
                    msg: '登录失败，密码错误',
                    ok: false,
                    data: null
                };
                res.json(output);
                return false;
            }
        } else {
            output = {
                code: 0,
                msg: '无此用户',
                ok: false,
                data: null
            };
            res.json(output);
            return false;
        }
    }).catch(err => {
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

router.post('/loginout', (req, res, next) => {
    let user = req.body.user;
    res.clearCookie('uid'); // 清除cookie中的uid
    req.session.destroy(() => { // 销毁session中的uid
        // res.redirect(302, '/login');
        output = {
            code: 1,
            msg: '',
            ok: true,
            data: null
        };
        res.json(output);
        return false;
    });
})

router.post('/register', (req, res, next) => {
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let salt = utils.UUid(8);
    User.findOne({
        name: name
    }).then(user => {
        if (user) {
            output = {
                code: 0,
                msg: '此用户已注册',
                ok: false,
                data: null
            };
            res.json(output);
            return false;
        } else {
            new User({
                name: name,
                password: md5(password + salt),
                email: email,
                salt: salt,
                delete: false,
                sync: false,
                create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
            }).save().then(user => {
                if (user._id) {
                    // 添加默认仓库
                    new Item({
                        uid: user._id,
                        name: 'example',
                        remark: 'example',
                        icon: '',
                        repository: '',
                        url: 'www.example.com',
                        own: user,
                        permissions: 'public',
                        members: [user],
                        delete: false,
                        sync: false,
                        create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                    }).save().then(item => {
                        // 添加默认模块
                        new Model({
                            uid: user._d,
                            itemid: item._id,
                            name: 'test',
                            remark: 'test',
                            item: item,
                            interfaces: [],
                            delete: false,
                            sync: false,
                            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                        }).save().then(model => {
                            if (model) {
                                // 添加默认接口
                                new Interface({
                                    uid: user._id,
                                    itemid: item._id,
                                    modelid: model._id,
                                    name: 'test',
                                    remark: 'test',
                                    item: item,
                                    model: model,
                                    request: {
                                        type: 'get',
                                        url: '/test/test',
                                        code: 200
                                    },
                                    fields: [{
                                        name: 'test',
                                        indispensable: true,
                                        type: 'string',
                                        default: '',
                                        remark: 'test'
                                    }],
                                    response: [{
                                        name: 'test',
                                        indispensable: true,
                                        type: 'string',
                                        default: '',
                                        remark: 'test'
                                    }],
                                    delete: false,
                                    sync: false,
                                    create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                                }).save().then(s => {
                                    if (s) {
                                        model.interfaces.push(s);
                                        model.save();
                                        item.models.push(model);
                                        item.save();
                                        output = {
                                            code: 1,
                                            msg: '注册成功',
                                            ok: true,
                                            data: null
                                        };
                                        res.json(output);
                                        return false;
                                    }
                                }).catch(err => {
                                    console.log(err)
                                    output = {
                                        code: 1,
                                        msg: '添加默认接口数据失败',
                                        ok: true,
                                        data: null
                                    };
                                    res.json(output);
                                    return false;
                                })
                            }
                        }).catch(err => {
                            console.log(err)
                            output = {
                                code: 1,
                                msg: '添加默认模块数据失败',
                                ok: true,
                                data: null
                            };
                            res.json(output);
                            return false;
                        })
                    }).catch(err => {
                        console.log(err)
                        output = {
                            code: 1,
                            msg: '添加默认仓库数据失败',
                            ok: true,
                            data: null
                        };
                        res.json(output);
                        return false;
                    })
                }
            }).catch(err => {
                console.log(err)
                output = {
                    code: 1,
                    msg: '添加用户信息失败',
                    ok: true,
                    data: null
                };
                res.json(output);
                return false;
            })
        }
    }).catch(err => {
        console.log(err)
    })
});

router.get('/get', (req, res, next) => {
    let uid = req.query.uid || req.session.uid;
    User.findById(uid).then(user => {
        if (user) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: user
            };
            res.json(output);
            return false;
        }
    }).catch(err => {
        console.log(err)
    })
});

module.exports = router;