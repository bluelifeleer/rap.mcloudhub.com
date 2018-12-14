'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const User = require('../models/user_model')
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

router.post('/login', (req, res, next)=>{
	console.log(req.body)
});

router.post('/register', (req, res, next)=>{
	console.log(req.body)
});

module.exports = router;