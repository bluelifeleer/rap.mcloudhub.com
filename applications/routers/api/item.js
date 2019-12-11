/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:16:55
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:58:27
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

router.post('/add', (req, res, next) => {
    let uid = req.body.uid || req.session.uid;
    let name = req.body.name || '';
    let remark = req.body.remark || '';
    let icon = req.body.icon || '';
    let repository = req.body.repository || '';
    let url = req.body.url || '';
    let permissions = req.body.permissions || 'public';
    User.findById(uid).then(user => {
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
        }).save().then(item => {
            if (item) {
                new Model({
                    uid: user._id,
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
                        new Interface({
                            uid: user._id,
                            itemid: item._id,
                            modelid: model._id,
                            name: 'test',
                            remark: 'test',
                            item: item,
                            model: model,
                            request: {
                                url: '/test/test',
                                type: 'get',
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
                                name: 'code',
                                indispensable: true,
                                type: 'number',
                                default: 0,
                                remark: '返回状态码'
                            }],
                            delete: false,
                            sync: false,
                            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                        }).save().then(s => {
                            if (s) {
                                model.interfaces.push(s);
                                model.save()
                                item.models.push(model);
                                item.save();
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
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                output = {
                    code: 0,
                    msg: 'error',
                    ok: false,
                    data: null
                };
                res.json(output);
                return false;
            }
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
});

router.post('/editor', (req, res, next) => {
    let uid = req.body.uid || req.session.uid;
    let id = req.body.id;
    let name = req.body.name;
    let remark = req.body.remark;
    let icon = req.body.icon;
    let url = req.body.url;
    let repository = req.body.repository;
    let permissions = req.body.permissions;

    Item.findByIdAndUpdate(id, {
        name: name,
        remark: remark,
        icon: icon,
        url: url,
        repository: repository,
        permissions: permissions
    }, {
        new: true,
        upsert: false,
        runValidators: true
    }).then(item => {
        if (item) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: null
            };
            res.json(output);
            return false;
        }
    }).catch(err => {
        console.log(err)
    })
});

router.get('/delete', (req, res, next) => {
    let id = req.query.id;
    let uid = req.session.uid;
    Item.findByIdAndUpdate(id, {
        delete: true
    }, {
        new: true,
        upsert: false,
        runValidators: true
    }).then(item => {
        output = {
            code: 1,
            msg: 'success',
            ok: true,
            data: item
        };
        res.json(output);
        return false;
    }).catch(err => {
        console.log(err)
    })
});

router.get('/lists', (req, res, next) => {
    let uid = req.query.uid || req.session.uid;
    Item.find({
        uid: uid,
        delete: false
    }).populate([{
        path: 'own',
        select: 'name'
    }]).then(items => {
        if (items) {
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
    }).catch(err => {
        console.log(err)
    })
});

router.get('/get', (req, res, next) => {
    let id = req.query.id;
    Item.findById(id).populate([{
        path: 'own',
        select: 'name'
    }, {
        path: 'models',
        select: 'name remark',
        populate: {
            path: 'interfaces',
            select: 'name request fields response'
        }
    }, {
        path: 'members',
        select: 'name avarat email'
    }]).then(item => {
        if (item) {
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
    }).catch(err => {
        console.log(err)
    })
});

module.exports = router;