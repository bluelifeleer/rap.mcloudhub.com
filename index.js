'use strict'
const os = require('os')
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const http2 = require('spdy')
const assert = require('assert')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const session = require('express-session')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const cdn = require('express-simple-cdn')
const swig = require('swig')
const debug = require('debug')('tools')
const sillyDateTime = require('silly-datetime')
const supportsColor = require('supports-color')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const uuidv4 = require('uuid/v4')
const expressRequestId = require('express-request-id')()
const expressCurl = require('express-curl')
const md5 = require('md5')
const sockerIO = require('socket.io')
const flash = require('flash');
const winston = require('winston');
const expressWinston = require('express-winston');
const credentials = require('./credentials.js');
const app = express()

//是否启动记录访问日志
const STARTLOG = true;
const options = {
    key: fs.readFileSync(path.join(__dirname + '/ssl/rap.mcloudhub.com.key')),
    cert: fs.readFileSync(path.join(__dirname + '/ssl/rap.mcloudhub.com.pem'))
};
//设置模板引擎
app.engine('html', swig.renderFile);
//  设置模板路径
app.set('views', path.join(__dirname, '/applications/views'));
// 注册模板
app.set('view engine', 'html');
// 将模板缓存设置false
swig.setDefaults({
    cache: false
});
app.use(helmet());
// 设置跨域
app.use(cors());
// 设置request id
app.use(expressRequestId);
// extends设置true表示接收的数据是数组，false表示是字符串
app.use(bodyParser.urlencoded({
    extended: true
}));
// 将提交的数据转成json,并且设置请求实体大小
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(cookieParser(credentials.cookieSecret, {
    maxAge: 1800000,
    secure: false, // 设置cookie只通过安全连接(HTTPS)发送
    httpOnly: true // 设置cookie 只能由服务器修改。也就是说客户端JavaScript不能修改它。这有助于防范XSS 攻击。
}));
// app.use(expressCurl);

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'rap',
    collection: 'sessions'
}, err => {
    if (err) throw err;
});

store.on('error', error => {
    assert.ifError(error);
    assert.ok(false);
});

app.use(session({
    genid: function(req) {
        return uuidv4() // use UUIDs for session IDs
    },
    secret: credentials.cookieSecret, // 与cookieParser中的一致
    resave: true, // 设置强制刷新session
    store: store, // 将session保存到mongodb中
    saveUninitialized: false, // 是否保存未初始化的会话，如果是true则会保存许多session会导致保存有效session失败,一般设置为false.
    cookie: {
        secure: false,
        maxAge: 1800000,
    },
    rolling: true
}));

app.use(flash());

// 服务器启动时默认配置/动作
app.use(function(req, res, next) {
    // //将登录后的用户信息附加到request头信息中
    if (req.cookies.uid && req.cookies.uid != '') {
        try {
            req.session.uid = req.cookies.uid;
        } catch (e) {
            console.log(e);
        }
    }
    // 将系统类型添加到cookies和请求头中;
    // os.platform return now node runing systems : darwin=>MAC win32=>windows
    res.cookie('platform', os.platform);
    req.platform = os.platform;
    // flash a message
    req.flash('info', 'hello!');
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

app.use(expressWinston.logger({
    transports: [
        // 将日志信息打印在控制台
        // new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs/combined.log')
        })
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function(req, res) {
        return false;
    } // optional: allows to skip some log messages based on request and/or response
}));

app.use(csurf({
    cookie: true,
    ignoreMethods: ['GET', 'POST']
}));
app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
});

// 记录访问日志
if (STARTLOG) {
    const logDirectory = path.join(__dirname, 'logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // 日志目录不存在创建目录
    const logerFile = 'access_' + sillyDateTime.format(new Date(), 'YYYY_MMM_DD') + '.log';
    const accessLogStream = rfs(logerFile, {
        interval: '1d', // 日志切割间隔为1天，以s,m,h,d为单位
        path: logDirectory, // 日志保存路径，
        size: '1M', // 单个日志文件的大小，以B,K,M,G为单位
        compress: true // 压缩日志
    });
    app.use(morgan('combined', {
        stream: accessLogStream
    }));
}

//设置静态文件托管
app.use('/static', express.static(path.join(__dirname, '/applications/statics')));
app.use(favicon(path.join(__dirname, './', 'favicon.ico')));

// 定义路由www
app.use('/', require(path.join(__dirname, '/applications/routers/main')));
app.use('/api/user', require(path.join(__dirname, '/applications/routers/api/user')));
app.use('/api/team', require(path.join(__dirname, '/applications/routers/api/team')));
app.use('/api/model', require(path.join(__dirname, '/applications/routers/api/model')));
app.use('/api/member', require(path.join(__dirname, '/applications/routers/api/member')));
app.use('/api/logs', require(path.join(__dirname, '/applications/routers/api/logs')));
app.use('/api/item', require(path.join(__dirname, '/applications/routers/api/item')));
app.use('/api/interface', require(path.join(__dirname, '/applications/routers/api/interface')));
app.use('/api/verify', require(path.join(__dirname, '/applications/routers/api/verify')));
app.use('/mock', require(path.join(__dirname, '/applications/routers/mock')));

// 处理404请求
// app.get('*', (req, res) => {
//     res.render(path.join(__dirname, '/app/views/404'), {
//         title: 'No Found'
//     });
// });

mongoose.connect('mongodb://bluelife:91732810802745ab0ae1ebef2d4adcab@120.24.20.48/rap', {
    useNewUrlParser: true
}, (err, res) => {
    if (err) {
        debug(err);
    } else {
        // 数据库连接成功后监听80/443端口
        // app.listen(80);
        http.createServer(app).listen(1004);
        // https.createServer(options, app).listen(443);
        // const server = http2.createServer(options, app);
        // server.listen(443);

    }
});
// app.listen(8080);
module.exports = app;