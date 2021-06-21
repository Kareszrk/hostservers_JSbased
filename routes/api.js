var express = require('express');
var router = express.Router();
var session = require('express-session');

// Global varriables / values
const uptotal = '<li><a href="contact.html"><i class="fas fa-phone icon-left"></i>+1 800 123 456</a></li><li><a href="contact.html"><i class="fas fa-comment icon-left"></i>Support Chat</a></li><li><a href="knowledge-base.html"><i class="fas fa-question-circle icon-left"></i>Knowledge Base</a></li><li><a href="service-status.html"><i class="fas fa-check icon-left"></i>Service Status</a></li>';
const menu = ["Home", "Login API"];
const menulink = ["/", "/loginapi"];
// End of Global varriables / values

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('API/apiIndex', { title: 'HostServers - API Documentation', notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "red",});
});

router.get('/loginapi', function(req, res, next) {
  res.render('API/loginAPI', { title: 'HostServers - Professional Server Hosting', notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "red",});
});

// NodeJS instead of htaccess
router.use(function(req, res) {
 res.status(400);
 res.render('error', {title: 'HostServers - Professional Server Hosting', notification: false, menu: menu, uptotal: uptotal, menulink: menulink, message: "The page you were looking for was not found, probably it was deleted or moved to another address."});
});

router.use(function(req, res) {
 res.status(500);
 res.render('error', {title: 'HostServers - Professional Server Hosting', notification: false, menu: menu, uptotal: uptotal, menulink: menulink, message: "You're not authorized to view this page."});
});

module.exports = router;
