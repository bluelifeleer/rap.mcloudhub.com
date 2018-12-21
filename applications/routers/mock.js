'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const url = require('url')
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const Mock = require('mockjs');
const User = require('../models/user_model');
const Interface = require('../models/interface_model');
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
	let data = {};
	Interface.findById(id).then(s=>{
		if(s){
			let responses = s.response;
			responses.forEach(response=>{
				switch(response.type){
					case 'array':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name+"|1-10"] = [
								{
								  "name|+1": [
									"Hello",
									"Mock.js",
									"!"
								  ]
								}
							  ];
							}
					}else{
						data[response.name] = response.default;
					}
					break;
					case 'boolean':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name+"|1-2"] = true;
						}
					}else{
						data[response.name] = response.default;
					}
					break;
					case 'number':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name+"|1-10"] = 0;
						}
					}else{
						data[response.name] = response.default;
					}
					break;
					case 'object':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name+"|1-10"] = {
								"110000": "北京市",
								"120000": "天津市",
								"130000": "河北省",
								"140000": "山西省"
							  };
						}
					}else{
						data[response.name] = response.default;
					}
					break;
					case 'function':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name] = function(){};
						}
					}else{
						data[response.name] = response.default;
					}
					break;
					case 'regexp':
					if(!(response.default)){
						if(response.roles){
							let roles = JSON.parse(response.roles), key = '';
							for(key in roles){
								data[key] = roles[key];
							}
						}else{
							data[response.name] = /[a-z][A-Z][0-9]/;
						}
					}else{
						data[response.name] = response.default;
					}
					break;
					default:	// string
						if(!(response.default)){
							if(response.roles){
								let roles = JSON.parse(response.roles), key = '';
								for(key in roles){
									data[key] = roles[key];
								}
							}else{
								data[response.name+"|1-12"] = "";
							}
						}else{
							data[response.name] = response.default;
						}
					break;
				}
			});
			let outputData = Mock.mock(data);
			// 输出结果
			res.json(outputData);
			return false;
		}
	}).catch(err=>{
		console.log(err);
	})
});

module.exports = router;