const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const subdomain = require('express-subdomain');
const fs = require('fs');
const https = require('https');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const session = require('express-session');
const mysql = require('mysql');
const noBots = require('express-nobots');

var app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/hostservers.pro/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/hostservers.pro/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/hostservers.pro/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);

app.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	// console.log('HTTPS Server running on port 443');
	console.log('[1] > SSL found');
	console.log('[2] > SSL loaded');
	console.log('[3] > CA verified');
	console.log('[4] > JavaScript files loaded');
	console.log('[5] > Operation detections');
	console.log('[6] > Observing DDoS protection');
	console.log('');
	console.log('System is now functioning!');
	console.log('HTTPS Server running on port 443');
});

var io = require('socket.io')(httpsServer);

io.sockets.on('connection', function(socket){
  const ip = socket.conn.remoteAddress;
  console.log('A new client connected! IP:'+ip);
  socket.on('sendmsg', message => {
    socket.broadcast.emit('chat-message', message);
		console.log(message);
  });
});

// view engine setup
app.engine("hbs", hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'max',saveUninitialized: false,resave: false}));
app.use(noBots({block:true}));

// Http to Https redirection

// app.use((req, res, next) => {
// 	if(req.protocol === "http"){
// 		res.redirect(301, 'https://'+req.headers.host+req.url);
// 	}
// 	next();
// });

// Automatic redirect from www to /, (not necessary)
app.all('/*', function(req, res, next) {
 if(/^www\./.test(req.headers.host)) {
			res.redirect(req.protocol + '://' + req.headers.host.replace(/^www\./,'') + req.url,301);
 } else {
  next();
 }
});

// Subdomains and foreign sites
app.use(subdomain('api', apiRouter));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
