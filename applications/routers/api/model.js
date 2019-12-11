/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:17:23
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:57:56
 */
'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const Mock = require('mockjs')
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

router.post('/add', (req, res, next) => {
    let uid = req.body.uid || req.session.uid;
    let item_id = req.body.item_id;
    let name = req.body.name;
    let remark = req.body.remark;
    Item.findById(item_id).then(item => {
        let user = User.findById(uid)
        return Promise.all([item, user]);
    }).spread((item, user) => {
        new Model({
            uid: user._id,
            itemid: item._id,
            name: name,
            remark: remark,
            item: item,
            delete: false,
            sync: false,
            create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
        }).save().then(model => {
            // 添加默认接口
            new Interface({
                uid: uid,
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
                model.interfaces.push(s)
                model.save();
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
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    })
});

router.get('/get', (req, res, next) => {
    let id = req.query.id;
    let select = req.query.select.join(' ') || '';
    Model.find({
        itemid: id,
        delete: false
    }, select).then(models => {
        if (models) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: models
            };
            res.json(output);
            return false;
        }
    }).catch(err => {
        console.log(err)
    })
});

module.exports = router;