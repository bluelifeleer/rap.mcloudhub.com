/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:39:34
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:52:09
 */
'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const utils = require('../../utils')
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

router.get('/captcha', (req, res, next) => {
    let captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 1,
        color: true,
        background: '#fff'
    });
    req.session.verify = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router;