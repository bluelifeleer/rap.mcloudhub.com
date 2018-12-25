'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const requestPromise = require('request-promise');
const md5 = require('md5');
const sillyDateTime = require('silly-datetime');
const svgCaptcha = require('svg-captcha');
const Mock = require('mockjs')
const User = require('../models/user_model');
const Item = require('../models/item_model');
const Model = require('../models/model_model');
const Interface = require('../models/interface_model');
const Team = require('../models/team_model');
const Log = require('../models/logs_model');
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

router.get('/verify', (req, res, next) => {
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

router.post('/user/login', (req, res, next) => {
	let checked = req.body.checked;
	let name = req.body.name;
	let password = req.body.password;
	let verify = req.body.verify;
	let cookieChecked = req.body.cookieChecked
	console.log(req.session.verify)
	if (!cookieChecked) {
		if (verify.toLowerCase() != req.session.verify.toLowerCase()) {
			output = {
				code: 0,
				msg: '验证码输入错误',
				ok: false,
				data: null
			};
			res.json(output);
			return false;
		}
	}

	User.findOne({
		name: name
	}).then(user => {
		if (user) {
			if (md5(password + user.salt) == user.password) {
				if (checked) {
					res.cookie('checked', checked, {
						maxAge: 1000 * 3600 * 10,
						expires: 1000 * 3600 * 10
					});
					res.cookie('password', password, {
						maxAge: 1000 * 3600 * 10,
						expires: 1000 * 3600 * 10
					});
				}
				res.cookie('name', user.name, {
					maxAge: 1000 * 3600 * 10,
					expires: 1000 * 3600 * 10
				});
				res.cookie('uid', user._id, {
					maxAge: 1000 * 3600 * 10,
					expires: 1000 * 3600 * 10
				});
				req.session.uid = user._id;
				req.session.name = user.name;
				output = {
					code: 1,
					msg: 'success',
					ok: true,
					data: null
				};
				res.json(output);
				return false;
			} else {
				output = {
					code: 0,
					msg: '登录失败，密码错误',
					ok: false,
					data: null
				};
				res.json(output);
				return false;
			}
		} else {
			output = {
				code: 0,
				msg: '无此用户',
				ok: false,
				data: null
			};
			res.json(output);
			return false;
		}
	}).catch(err => {
		console.log(err)
		output = {
			code: 0,
			msg: 'error',
			ok: false,
			data: null
		};
		res.json(output);
		return false;
	})
});

router.post('/user/loginout', (req, res, next) => {
	let user = req.body.user;
	res.clearCookie('uid'); // 清除cookie中的uid
	req.session.destroy(() => { // 销毁session中的uid
		// res.redirect(302, '/login');
		output = {
			code: 1,
			msg: '',
			ok: true,
			data: null
		};
		res.json(output);
		return false;
	});
})

router.post('/user/register', (req, res, next) => {
	let name = req.body.name;
	let password = req.body.password;
	let email = req.body.email;
	let salt = MyDate.getTime();
	User.findOne({
		name: name
	}).then(user => {
		if (user) {
			output = {
				code: 0,
				msg: '此用户已注册',
				ok: false,
				data: null
			};
			res.json(output);
			return false;
		} else {
			new User({
				name: name,
				password: md5(password + salt),
				email: email,
				salt: salt,
				delete: false,
				sync: false,
				create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
			}).save().then(user => {
				if (user._id) {
					// 添加默认仓库
					new Item({
						uid: user._id,
						name: 'example',
						remark: 'example',
						icon: '',
						repository: '',
						url: 'www.example.com',
						own: user,
						permissions: 'public',
						members: [user],
						delete: false,
						sync: false,
						create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
					}).save().then(item => {
						// 添加默认模块
						new Model({
							uid: user._d,
							itemid: item._id,
							name: 'test',
							remark: 'test',
							item: item,
							interfaces: [],
							delete: false,
							sync: false,
							create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
						}).save().then(model => {
							if (model) {
								// 添加默认接口
								new Interface({
									uid: user._id,
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
									if (s) {
										model.interfaces.push(s);
										model.save();
										item.models.push(model);
										item.save();
										output = {
											code: 1,
											msg: '注册成功',
											ok: true,
											data: null
										};
										res.json(output);
										return false;
									}
								}).catch(err => {
									console.log(err)
									output = {
										code: 1,
										msg: '添加默认接口数据失败',
										ok: true,
										data: null
									};
									res.json(output);
									return false;
								})
							}
						}).catch(err => {
							console.log(err)
							output = {
								code: 1,
								msg: '添加默认模块数据失败',
								ok: true,
								data: null
							};
							res.json(output);
							return false;
						})
					}).catch(err => {
						console.log(err)
						output = {
							code: 1,
							msg: '添加默认仓库数据失败',
							ok: true,
							data: null
						};
						res.json(output);
						return false;
					})
				}
			}).catch(err => {
				console.log(err)
				output = {
					code: 1,
					msg: '添加用户信息失败',
					ok: true,
					data: null
				};
				res.json(output);
				return false;
			})
		}
	}).catch(err => {
		console.log(err)
	})
});

router.get('/user/get', (req, res, next) => {
	let uid = req.query.uid || req.session.uid;
	User.findById(uid).then(user => {
		if (user) {
			output = {
				code: 1,
				msg: 'success',
				ok: true,
				data: user
			};
			res.json(output);
			return false;
		}
	}).catch(err => {
		console.log(err)
	})
});

router.post('/item/add', (req, res, next) => {
	let uid = req.body.uid || req.session.uid;
	let name = req.body.name || '';
	let remark = req.body.remark || '';
	let icon = req.body.icon || '';
	let repository = req.body.repository || '';
	let url = req.body.url || '';
	let permissions = req.body.permissions || 'public';
	User.findById(uid).then(user => {
		new Item({
			uid: user._id,
			name: name,
			remark: remark,
			icon: icon,
			repository: repository,
			permissions: permissions,
			members: [user],
			url: url,
			own: user,
			delete: false,
			sync: false,
			create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
		}).save().then(item => {
			if (item) {
				new Model({
					uid: user._id,
					itemid: item._id,
					name: 'test',
					remark: 'test',
					item: item,
					interfaces: [],
					delete: false,
					sync: false,
					create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
				}).save().then(model => {
					if (model) {
						new Interface({
							uid: user._id,
							itemid: item._id,
							modelid: model._id,
							name: 'test',
							remark: 'test',
							item: item,
							model: model,
							request: {
								url: '/test/test',
								type: 'get',
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
								name: 'code',
								indispensable: true,
								type: 'number',
								default: 0,
								remark: '返回状态码'
							}],
							delete: false,
							sync: false,
							create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
						}).save().then(s => {
							if (s) {
								model.interfaces.push(s);
								model.save()
								item.models.push(model);
								item.save();
								output = {
									code: 1,
									msg: 'success',
									ok: true,
									data: {
										item: {
											id: item._id
										}
									}
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
			} else {
				output = {
					code: 0,
					msg: 'error',
					ok: false,
					data: null
				};
				res.json(output);
				return false;
			}
		}).catch(err => {
			console.log(err)
		})
	}).catch(err => {
		console.log(err)
	})
});

router.post('/item/editor', (req, res, next) => {
	let uid = req.body.uid || req.session.uid;
	let id = req.body.id;
	let name = req.body.name;
	let remark = req.body.remark;
	let icon = req.body.icon;
	let url = req.body.url;
	let repository = req.body.repository;
	let permissions = req.body.permissions;

	Item.findOneAndUpdate({
		_id: id,
		uid: uid
	}, {
		name: name,
		remark: remark,
		icon: icon,
		url: url,
		repository: repository,
		permissions: permissions
	}, {
		new: true,
		upsert: false,
		runValidators: true
	}).then(item => {
		if (item) {
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
});

router.get('/item/delete', (req, res, next) => {
	let id = req.query.id;
	let uid = req.session.uid;
	Item.findOneAndUpdate({
		_id: id,
		uid: uid
	}, {
		delete: true
	}, {
		new: true,
		upsert: false,
		runValidators: true
	}).then(item => {
		output = {
			code: 1,
			msg: 'success',
			ok: true,
			data: item
		};
		res.json(output);
		return false;
	}).catch(err => {
		console.log(err)
	})
});

router.get('/item/lists', (req, res, next) => {
	let uid = req.query.uid || req.session.uid;
	Item.find({
		uid: uid,
		delete: false
	}).populate([{
		path: 'own',
		select: 'name'
	}]).then(items => {
		if (items) {
			output = {
				code: 1,
				msg: 'success',
				ok: true,
				data: {
					items: items
				}
			};
			res.json(output);
			return false;
		}
	}).catch(err => {
		console.log(err)
	})
});

router.get('/item/get', (req, res, next) => {
	let id = req.query.id;
	Item.findById(id).populate([{
		path: 'own',
		select: 'name'
	}, {
		path: 'models',
		select: 'name remark',
		populate: {
			path: 'interfaces',
			select: 'name request fields response'
		}
	}, {
		path: 'members',
		select: 'name avarat email'
	}]).then(item => {
		if (item) {
			output = {
				code: 1,
				msg: 'success',
				ok: true,
				data: {
					item: item
				}
			};
			res.json(output);
			return false;
		}
	}).catch(err => {
		console.log(err)
	})
});

router.post('/model/add', (req, res, next) => {
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

router.post('/interface/add', (req, res, next) => {
	let uid = req.body.uid || req.session.uid;
	let item_id = req.body.item_id;
	let model_id = req.body.model_id;
	let name = req.body.name;
	let remark = req.body.remark;
	let request = req.body.request;
	let fields = [{
		name: "test",
		remark: "test",
		type: "string",
		roles: "",
		default: "",
		indispensable: false
	}];
	let response = [{
		name: "test",
		remark: "test",
		type: "string",
		roles: "",
		default: "",
		indispensable: false
	}];

	Item.findById(item_id).then(item => {
		let user = User.findById(uid);
		let model = Model.findById(model_id);
		return Promise.all([user, model, model]);
	}).spread((user, item, model) => {
		new Interface({
			uid: user._id,
			itemid: item_id,
			modelid: model_id,
			name: name,
			remark: remark,
			item: item,
			model: model,
			request: request,
			fields: fields,
			response: response,
			delete: false,
			sync: false,
			create: sillyDateTime.format(MyDate, 'YYYY-MM-DD HH:mm:ss')
		}).save().then(add => {
			model.interfaces.push(add);
			model.save();
			output = {
				code: 1,
				msg: 'success',
				ok: true,
				data: {
					interface: add._id
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
});

router.post('/interface/params/editor', (req, res, next) => {
	let uid = req.body.uid || req.session.uid;
	let item_id = req.body.item_id;
	let model_id = req.body.model_id;
	let id = req.body.id;
	let name = req.body.name;
	let remark = req.body.remark;
	let request = req.body.request;
	Interface.findByIdAndUpdate(id, {
		name: name,
		remark: remark,
		request: request
	}).then(s => {
		if (s) {
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
});

router.post('/interface/editor', (req, res, next) => {
	let type = req.body.type;
	let data = req.body.data;
	Interface.findById(data.id).then(result => {
		if (result) {
			if (type == 'request') {
				result.fields.push({
					name: data.name,
					remark: data.remark,
					type: data.type,
					roles: data.roles,
					default: data.default,
					indispensable: data.indispensable
				})
			} else if (type == 'response') {
				result.response.push({
					name: data.name,
					remark: data.remark,
					type: data.type,
					roles: data.roles,
					default: data.default,
					indispensable: data.indispensable
				})
			} else {

			}
			result.save().then(s => {
				output = {
					code: 1,
					msg: 'success',
					ok: true,
					data: null
				};
				res.json(output);
				return false;
			}).catch(err => {
				console.log(err)
			})
		}
	}).catch(err => {
		console.log(err)
	});
})

router.get('/interface/delete', (req, res, next) => {
	let id = req.query.id;
	let model_id = req.query.model_id;
	Model.findOne({
		_id: model_id
	}).then(model => {
		let tmp = [];
		model.interfaces.forEach(s => {
			if (s != id) {
				tmp.push(s)
			}
		})
		model.interfaces = tmp;
		model.save();
		Interface.findOneAndDelete({
			_id: id
		}).then(del => {
			if (del) {
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
	}).catch(err => {
		console.log(err)
	})
});

router.post('/interface/move', (req, res, next) => {
	let id = req.body.id;
	let model_id = req.body.model_id;
	let type = req.body.type;
	console.log(id)
	console.log(model_id)
	console.log(type)
	// 1：判断模块中是否有此接口
	// 2：有则报错，没有则移动
	// 3：判断是移动还是复制
	// Model.findById(model_id).then(model=>{
	// 	Interface.findById(id).then(int=>{
	// 		if(type){	// 复制

	// 		}else{	// 移动

	// 		}
	// 	})
	// }).catch(err=>{
	// 	console.log(err)
	// })
});

router.get('/model/get', (req, res, next) => {
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

router.post('/team/add', (req, res, next) => {
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

router.post('/team/editor', (req, res, next) => {

});

router.get('/team/delete', (req, res, next) => {

});

router.get('/team/get', (req, res, next) => {

});

router.get('/team/lists', (req, res, next) => {
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

router.get('/member/lists', (req, res, next) => {
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

router.post('/interface/request/editor', (req, res, next) => {
	let id = req.body.id;
	let index = req.body.index;
	let name = req.body.name;
	let remark = req.body.remark;
	let type = req.body.type;
	let roles = req.body.roles;
	let defaultValue = req.body.default;
	let indispensable = req.body.indispensable;
	Interface.findById(id).then(s=>{
		if(s){
			let fields = s.fields, tmp = [];
			fields.forEach((field, i)=>{
				if(i == index){
					tmp.push({
						name: name,
						remark: remark,
						type: type,
						roles: roles,
						default: defaultValue,
						indispensable: indispensable
					})
				}else{
					tmp.push(field)
				}
			})
			s.fields = tmp;
			s.save().then(status=>{
				if(status){
					output = {
						code: 1,
						msg: 'success',
						ok: true,
						data: null
					};
					res.json(output);
					return false;
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	}).catch(err=>{
		console.log(err)
	})
});

router.get('/interface/request/delete', (req, res, next) => {
	let index = req.query.index;
	let id = req.query.id;
	Interface.findById(id).then(s=>{
		if(s){
			let fields = s.fields, tmp = [];
			fields.forEach((field, i)=>{
				if(index != i){
					tmp.push(field);
				}
			});
			s.fields = tmp;
			s.save().then(status=>{
				if(status){
					output = {
						code: 1,
						msg: 'success',
						ok: true,
						data: null
					};
					res.json(output);
					return false;
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	}).catch(err=>{
		console.log(err)
	})
});

router.post('/interface/response/editor', (req, res, next) => {
	let id = req.body.id;
	let index = req.body.index;
	let name = req.body.name;
	let remark = req.body.remark;
	let type = req.body.type;
	let roles = req.body.roles;
	let defaultValue = req.body.default;
	let indispensable = req.body.indispensable;
	Interface.findById(id).then(s=>{
		if(s){
			let responses = s.response, tmp = [];
			responses.forEach((response, i)=>{
				if(i == index){
					tmp.push({
						name: name,
						remark: remark,
						type: type,
						roles: roles,
						default: defaultValue,
						indispensable: indispensable
					})
				}else{
					tmp.push(response)
				}
			})
			s.response = tmp;
			s.save().then(status=>{
				if(status){
					output = {
						code: 1,
						msg: 'success',
						ok: true,
						data: null
					};
					res.json(output);
					return false;
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	}).catch(err=>{
		console.log(err)
	})
})

router.get('/interface/response/delete', (req, res, next) => {
	let index = req.query.index;
	let id = req.query.id;
	Interface.findById(id).then(s=>{
		let responses = s.response, tmp = [];
		responses.forEach((response, i)=>{
			if(index != i){
				tmp.push(response)
			}
		});
		s.response = tmp;
		s.save().then(status=>{
			if(status){
				output = {
					code: 1,
					msg: 'success',
					ok: true,
					data: null
				};
				res.json(output);
				return false;
			}
		}).catch(err=>{
			console.log(err)
		})
	}).catch(err=>{
		console.log(err)
	})
});
module.exports = router;