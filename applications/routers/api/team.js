/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:18:15
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:57:46
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

router.post('/add', (req, res, next) => {
    let uid = req.body.uid;
    let name = req.body.name;
    let remark = req.body.remark;
    let permissions = req.body.permissions;
    let members = req.body.members;
    if (!(members.length)) {
        User.findById(uid).then(user => {
            if (user) {
                members.push(user)
                Team({
                    uid: user._id,
                    name: name,
                    remark: remark,
                    own: user,
                    item: [],
                    members: members,
                    permissions: permissions,
                    delete: false,
                    sync: false,
                    create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
                }).save().then(team => {
                    if (team) {
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
            }
        }).catch(err => {
            console.log(err)
        })
    }
});

router.post('/editor', (req, res, next) => {

});

router.get('/delete', (req, res, next) => {

});

router.get('/get', (req, res, next) => {

});

router.get('/lists', (req, res, next) => {
    let uid = req.query.uid || req.session.uid;
    let num = parseInt(req.query.num) || 10;
    let size = parseInt(req.query.size) || 1;
    Team.countDocuments({
        uid: uid
    }).then(count => {
        Team.find({
            uid: uid
        }).skip(parseInt((size - 1) * num)).limit(num).populate([{
            path: 'own',
            select: 'name avarat email'
        }, {
            path: 'item',
            select: 'uid name remark repository icon'
        }, {
            path: 'members',
            select: 'name avarat email'
        }]).then(teams => {
            if (teams) {
                output = {
                    code: 1,
                    msg: 'success',
                    ok: true,
                    data: {
                        num: num,
                        size: size,
                        count: count,
                        teams: teams
                    }
                };
                res.json(output);
                return false;
            }
        }).catch(err => {
            console.log(err)
        });
    }).catch(err => {
        console.log(err)
    });
});

module.exports = router;