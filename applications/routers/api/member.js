/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:18:46
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:58:00
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

router.get('/lists', (req, res, next) => {
    User.find({}).then(users => {
        if (users) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    users: users
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