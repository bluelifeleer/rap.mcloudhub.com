'use strict'
const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/index', {
            title: '首页',
            page: 'index'
        })
    }else{
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
    
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

router.get('/reset', (req, res, next) => {
    res.render('../views/reset', {
        title: '重置密码',
        page: 'reset'
    })
});

router.get('/repository', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/repository', {
            title: '仓库',
            page: 'repository'
        })
    }else{
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
})

router.get('/repository/editor', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/repository/editor', {
            title: '添加模块',
            page: 'editor'
        })
    }else{
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
})

router.get('/team', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {   
        res.render('../views/team', {
            title: '团队',
            page: 'team'
        })
    }else{
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
})

router.get('/status', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/status', {
            title: '状态',
            page: 'status'
        })
    }else{
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
})

module.exports = router;