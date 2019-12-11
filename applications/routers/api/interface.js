/*
 * @Author: bluelife
 * @Date:   2019-12-11 00:17:45
 * @Last Modified by:   bluelife
 * @Last Modified time: 2019-12-11 00:59:02
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

router.post('/params/editor', (req, res, next) => {
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
    }, {
        new: true,
        upsert: false,
        runValidators: true
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

router.post('/editor', (req, res, next) => {
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

router.get('/delete', (req, res, next) => {
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

router.post('/move', (req, res, next) => {
    let id = req.body.id;
    let model_id = req.body.model_id;
    let type = req.body.type;
    // 1：判断模块中是否有此接口
    // 2：有则报错，没有则移动
    // 3：判断是移动还是复制
    Model.findById(model_id).then(model => {
        Interface.findById(id).then(s => {
            if (s) {
                model.interfaces.push(s);
                model.save().then(status => {
                    if (status) {
                        if (!type) {
                            Model.findById(s.modelid).then(m => {
                                if (m) {
                                    let tmp = [];
                                    m.interfaces.forEach(b => {
                                        if (b._id != id) {
                                            tmp.push(b)
                                        }
                                    });
                                    m.interfaces = tmp;
                                    m.save().then(a => {
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
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        })
    }).catch(err => {
        console.log(err)
    })
});

router.post('/request/editor', (req, res, next) => {
    let id = req.body.id;
    let index = req.body.index;
    let name = req.body.name;
    let remark = req.body.remark;
    let type = req.body.type;
    let roles = req.body.roles;
    let defaultValue = req.body.default;
    let indispensable = req.body.indispensable;
    Interface.findById(id).then(s => {
        if (s) {
            let fields = s.fields,
                tmp = [];
            fields.forEach((field, i) => {
                if (i == index) {
                    tmp.push({
                        name: name,
                        remark: remark,
                        type: type,
                        roles: roles,
                        default: defaultValue,
                        indispensable: indispensable
                    })
                } else {
                    tmp.push(field)
                }
            })
            s.fields = tmp;
            s.save().then(status => {
                if (status) {
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
});

router.get('/request/delete', (req, res, next) => {
    let index = req.query.index;
    let id = req.query.id;
    Interface.findById(id).then(s => {
        if (s) {
            let fields = s.fields,
                tmp = [];
            fields.forEach((field, i) => {
                if (index != i) {
                    tmp.push(field);
                }
            });
            s.fields = tmp;
            s.save().then(status => {
                if (status) {
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
});

router.post('/response/editor', (req, res, next) => {
    let id = req.body.id;
    let index = req.body.index;
    let name = req.body.name;
    let remark = req.body.remark;
    let type = req.body.type;
    let roles = req.body.roles;
    let defaultValue = req.body.default;
    let indispensable = req.body.indispensable;
    Interface.findById(id).then(s => {
        if (s) {
            let responses = s.response,
                tmp = [];
            responses.forEach((response, i) => {
                if (i == index) {
                    tmp.push({
                        name: name,
                        remark: remark,
                        type: type,
                        roles: roles,
                        default: defaultValue,
                        indispensable: indispensable
                    })
                } else {
                    tmp.push(response)
                }
            })
            s.response = tmp;
            s.save().then(status => {
                if (status) {
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
})

router.get('/response/delete', (req, res, next) => {
    let index = req.query.index;
    let id = req.query.id;
    Interface.findById(id).then(s => {
        let responses = s.response,
            tmp = [];
        responses.forEach((response, i) => {
            if (index != i) {
                tmp.push(response)
            }
        });
        s.response = tmp;
        s.save().then(status => {
            if (status) {
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

module.exports = router;