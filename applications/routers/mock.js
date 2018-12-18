'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const Mock = require('mockjs');
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

router.get('/test/data', (req, res, next) => {
	let id = req.query.id;
	output = {
		code: 1,
		msg: 'success',
		ok: true,
		data: {
			id: id
		}
	};
	res.json(output);
	return false;
});

module.exports = router;