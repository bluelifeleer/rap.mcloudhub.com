'use strict'
const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    res.render('../views/index', {
        title: '首页',
        page: 'index'
    })
});

router.get('/login', (req, res, next) => {
    res.render('../views/login', {
        title: '登录',
        page: 'login'
    })
});

router.get('/register', (req, res, next) => {
    res.render('../views/register', {
        title: '注册',
        page: 'register'
    })
});

module.exports = router;