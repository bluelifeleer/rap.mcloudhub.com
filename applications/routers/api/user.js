/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:16:01
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:16:34
 */
'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const Mock = require('mockjs')
const utils = require('../utils')
const User = require('../models/user_model');
const Item = require('../models/item_model');
const Model = require('../models/model_model');
const Interface = require('../models/interface_model');
const Team = require('../models/team_model');
const Logs = require('../models/logs_model');
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

module.exports = router;