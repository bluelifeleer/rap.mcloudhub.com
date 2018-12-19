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
	var data = Mock.mock({
		// 属性 list 的值是一个数组，其中含有 1 到 10 个元素
		'list|1-10': [{
			// 属性 id 是一个自增数，起始值为 1，每次增 1
			'id|+1': 1
		}],
		"object|2": {
			"310000": "上海市",
			"320000": "江苏省",
			"330000": "浙江省",
			"340000": "安徽省"
		  }
	})
	// 输出结果
	// console.log(JSON.stringify(data, null, 4))
	output = {
		code: 1,
		msg: 'success',
		ok: true,
		data: data
	};
	res.json(output);
	return false;
});

module.exports = router;