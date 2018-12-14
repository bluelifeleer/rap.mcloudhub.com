'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const User = require('../models/user_model')
const Item = require('../models/item_model')
const ItemLog = require('../models/item_log_model')

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

router.post('/item/add', (req, res, next)=>{
	let uid = req.body.uid || req.session.uid;
	let name = req.body.name;
	let describe = req.body.describe;
	let logo = req.body.logo;
	let remark = req.body.remark;
	let base_url = req.body.base_url;

	new Item({
		uid: md5(''),
		name: name,
		describe: describe,
		remark: remark,
		logo: logo,
		base_url: base_url,
		create_time: sillyDateTime.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
		delete: true,
		sync: false
	}).save().then(insert=>{
		if(insert){
			output = {
		        code: 1,
		        msg: 'Success',
		        ok: true,
		        data: {}
		    };
		}
	}).catch(err=>{
		console.log(err)
		output = {
		    code: 0,
		    msg: 'Error',
		    ok: false,
		    data: err
		};
	})

	res.send(output);
});

router.get('/item/list', (req, res, next)=>{
	let uid = req.query.uid || req.session.uid;
	let num = parseInt(req.query.num) || 20;
	let offset = parseInt(req.query.offset) || 1;
	Item.countDocuments({ uid: uid }, (err, count)=>{
		Item.find({ uid: uid }).skip((offset ? (parseInt(offset-1)*num) :offset)).limit(num).then(item=>{
			output = {
		        code: 1,
		        msg: 'Success',
		        ok: true,
		        data: {
		        	count: count,
		        	list: item,
		        	num: num,
		        	offset: offset
		        }
		    };
		    res.send(output);
		}).catch(err=>{
			output = {
			    code: 0,
			    msg: 'Error',
			    ok: false,
			    data: err
			};
			res.send(output);
		});
	});
})

module.exports = router;