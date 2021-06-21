const express = require('express');
const mysql = require('mysql');
const md5 = require('md5');
const randomstring = require('randomstring');
const Nexmo = require('nexmo');
const dateFormat = require('dateformat');
const now = new Date();
const processJS = require('./process');
const knowledgebase_network = require('./knowledge_base');
const router = express.Router();

// Global varriables / values
const uptotal = '<li><a href="contact.html"><i class="fas fa-phone icon-left"></i>+1 800 123 456</a></li><li><a href="contact.html"><i class="fas fa-comment icon-left"></i>Support Chat</a></li><li><a href="/knowledgebase"><i class="fas fa-question-circle icon-left"></i>Knowledge Base</a></li><li><a href="/statistic"><i class="fas fa-check icon-left"></i>Service Status</a></li>';
const menu = ["Home", "Minecraft Server", "Market Place", "Speedtest"];
const menulink = ["/", "/minecraft", "/marketplace", "/speedtest"];
const website_title = 'HostServers - Professional Server Hosting';
// End of Global varriables / values

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/statistic', function(req, res, next) {
  res.render('statistic', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/client', function(req, res, next) {
  if (req.session.loggedIn) {
    res.redirect('/account');
    return false;
  } else {
    res.render('login', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
  }
});

router.get('/minecraft', function(req, res, next) {
  res.render('minecraft', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "minecraft", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/datacenter', function(req, res, next) {
  res.render('datacenter', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "orange", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/knowledgebase', function(req, res, next) {
  var con = mysql.createConnection({
    host: hostname_,
    user: username_,
    password: password_,
    database: database_,
  });
  // This is how knowledgebase array built.
  // var knowledgebase_array = [{
  //   "latest": {
  //     1: {
  //       "question": "How are you doing?",
  //       "link": "/knowledgebase/1",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //     2: {
  //       "question": "What is your name?",
  //       "link": "/knowledgebase/2",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //   },
  //
  //   "popularity": {
  //     1: {
  //       "question": "How to setup SSL?",
  //       "link": "/knowledgebase/3",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //     2: {
  //       "question": "How to masturbate?",
  //       "link": "/knowledgebase/4",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //   },
  // }];
  // End of "This is how knowledgebase array built."

  // var knowledgebase_array = [{
  //   'latest': {
  //
  //   },
  //
  //   'popularity': {
  //     1: {
  //       "question": "How to setup SSL?",
  //       "link": "/knowledgebase/3",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //     2: {
  //       "question": "How to masturbate?",
  //       "link": "/knowledgebase/4",
  //       "creationdate": "November 2, 2017 at 12:45",
  //     },
  //   },
  // }];

  // Mechanics of how it works.
  // var newA = {
  //   "question": "asdasd",
  //   "link": "/knowledgebase/asdasdasd",
  //   "creationdate": "November 4, 2017 at 12:45",
  // };
  //
  // var newAa = {
  //   "question": "Google",
  //   "link": "/knowledgebase/google",
  //   "creationdate": "November 1, 2017 at 12:45",
  // };
  //
  // knowledgebase_array[0]["latest"][1] = newA;
  // knowledgebase_array[0]["latest"][2] = newAa;

  // Array setup that we will fill up
  var knowledgebase_array = [{
    'latest': {

    },

    'popularity': {

    },
  }];

  // Build up "LATEST" side of the page.
  con.query('SELECT * FROM knowledgebase ORDER BY id DESC LIMIT ?', [5], function (error, results, fields) {
  if (error) throw error;
  if(results.length > 0){
    Object.keys(results).forEach(function(key) {
      var row = results[key];
      if(results.length > 0){
        var newAa;
          newAa = {
            "question": row.question,
            "link": "/knowledgebase/"+ row.know_identifier,
            "creationdate": dateFormat(row.creation_date, "mmmm d, yyyy h:MM TT"),
            "likes": row.likes,
          };
          knowledgebase_array[0]["latest"][row.id] = newAa;
      }
    });
  }
});
con.query('SELECT * FROM knowledgebase WHERE solved = ? ORDER BY likes DESC LIMIT ?', [true, 5], function (error, results, fields) {
  if (error) throw error;
  if(results.length > 0){
    Object.keys(results).forEach(function(key) {
      var row = results[key];
      if(results.length > 0){
        var newAaA;
          newAaA = {
            "question": row.question,
            "link": "/knowledgebase/"+ row.know_identifier,
            "creationdate": dateFormat(row.creation_date, "mmmm d, yyyy h:MM TT"),
            "likes": row.likes,
          };
          knowledgebase_array[0]["popularity"][row.id] = newAaA;
      }
    });
    console.log(knowledgebase_array[0]);
  }
});
setTimeout(function(){
  res.render('knowledgebase', { title: 'KnowledgeBase - '+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, knowledgebase_array: knowledgebase_array, homepage: true});
}, 100);
con.end();
});

router.get('/advertiesments', function(req, res, next) {
  res.render('advertiesments', { title: 'Advertiesment - '+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "orange", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/speedtest', function(req, res, next) {
  res.render('speedtest', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/terms', function(req, res, next) {
  res.render('terms', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
});

router.get('/knowledgebase/newpost', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.redirect('/phoneverification');
    } else {
    res.render('knowledgebase_share', { title: 'KnowledgeBase - '+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
    }
  } else {
    res.redirect('/client');
  }
});

router.get('/knowledgebase/:identifier', function(req, res, next){
  var con = mysql.createConnection({
    host: hostname_,
    user: username_,
    password: password_,
    database: database_,
  });
  con.query('SELECT * FROM knowledgebase WHERE know_identifier = ?', [req.params.identifier], function (error, results, fields) {
  if (error) throw error;
  Object.keys(results).forEach(function(key) {
      var row = results[key];
      if(results.length > 0){
        res.render('knowledgebase', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, profilePTrue: false, knowledgeFound: true,});
      } else {
        res.render('knowledgebase', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, profilePTrue: false, knowledgeFound: false,});
      }
    });
  });
  con.end();
});

router.get('/marketplace', function(req, res, next) {
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.render('marketplace', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, profilePTrue: false,});
    } else {
      res.render('marketplace', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, profilePTrue: true,});
    }
  } else {
    res.render('marketplace', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, profilePTrue: false,});
  }
});

router.get('/signout', function(req, res, next){
  if(req.session.loggedIn){
    req.session.loggedIn = false;
    req.session.userID = false;
    req.session.nickName = false;
    req.session.profileDetails = false;
    res.redirect('/client');
  } else {
    res.redirect('/client');
  }
});

router.get('/account', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.redirect('/phoneverification');
    } else {
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      var result_Q = [];
      con.connect(function(err) {
        var sql = "SELECT transaction_name, transaction_worth, recorded_at FROM `transactions` WHERE `owner` = ?";
        con.query(sql, [req.session.userID], function (err, result, fields) {
          if (err) throw err;
            Object.keys(result).forEach(function(key) {
              var row = result[key];
              var recorded_at = dateFormat(row.recorded_at, "mmm d, yyyy h:MM TT");
              result_Q = [{
                "transaction_name" : row.transaction_name,
                "transaction_worth" : row.transaction_worth,
                "recorded_at" : recorded_at,
              }]
              console.log(result);
              console.log(result_Q);
            });
            res.render('control/account', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, transactions: result_Q});
        });
      });
    }
  } else {
    res.redirect('/client');
  }
});

router.get('/newOrder', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.redirect('/phoneverification');
    } else {
    res.render('control/neworder', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
    }
  } else {
    res.redirect('/client');
  }
});

router.get('/phoneverification', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] == "true"){
      res.redirect('/account');
    } else {
    res.render('control/sms', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
  }
  } else {
    res.redirect('/client');
  }
});

router.get('/settings', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] == "false"){
      res.redirect('/phoneverification');
    } else {
    res.render('control/settings', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails,});
  }
  } else {
    res.redirect('/client');
  }
});

router.get('/dashboard', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.redirect('/phoneverification');
    } else {
    res.render('control/dashboard', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails});
    }
  } else {
    res.redirect('/client');
  }
});

// SERVER CONTROL DASHBOARD - RootUI -
router.get('/dashboard/:port', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] != "true"){
      res.redirect('/phoneverification');
    } else {
    if(req.params.port){
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      var owner = false;
      var start = false;
      var stop = false;
      var restart = false;
      var editconfig = false;
      var filemanager = false;
      var consolecommand = false;
      var reinstall = false;
      var database = false;
      con.connect(function(err) {
        var sql = "SELECT server_owner, server_name, server_type, port, service_start, service_end, installedservices, memory, storage, shared_with, control_permission FROM `servers` WHERE `server_owner` = ? AND `port` = ? OR JSON_CONTAINS(shared_with, '[?]')  AND `port` = ?";
        con.query(sql, [req.session.userID, req.params.port, req.session.userID, req.params.port], function (err, result, fields) {
          if (err) throw err;
          if (result.length > 0) {
            Object.keys(result).forEach(function(key) {
             var row = result[key];
             if (row.server_owner == req.session.userID) {
               owner = true;
               start = true;
               stop = true;
               restart = true;
               editconfig = true;
               filemanager = true;
               consolecommand = true;
               reinstall = true;
               database = true;
             }else{
               owner = false;
               permissions = row.control_permission;
               teszt = JSON.parse(permissions);
               if (teszt[req.session.userID]["start"] == "Y") {
                 start = true;
               }else{
                 start = false;
               }
               if (teszt[req.session.userID]["stop"] == "Y") {
                 stop = true;
               }else{
                 stop = false;
               }
               if (teszt[req.session.userID]["restart"] == "Y") {
                 restart = true;
               }else{
                 restart = false;
               }
               if (teszt[req.session.userID]["editconfig"] == "Y") {
                 editconfig = true;
               }else{
                 editconfig = false;
               }
               if (teszt[req.session.userID]["filemanager"] == "Y") {
                 filemanager = true;
               }else{
                 filemanager = false;
               }
               if (teszt[req.session.userID]["consolecommand"] == "Y") {
                 consolecommand = true;
               }else{
                 consolecommand = false;
               }
               if (teszt[req.session.userID]["reinstall"] == "Y") {
                 reinstall = true;
               }else{
                 reinstall = false;
               }
               if (teszt[req.session.userID]["database"] == "Y") {
                 database = true;
               }else{
                 database = false;
               }
             }
           });
            if (req.session.profileDetails[7] == "light") {
              light = true;
              dark = false;
            }else{
              light = false;
              dark = true;
            }
            res.render('rootUI_dashboard/index', { title: "Dashboard - "+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, rootui: true, server_datas: result, owner: owner, start: start, stop: stop, restart: restart, editconfig: editconfig, filemanager: filemanager, consolecommand: consolecommand, reinstall: reinstall, database: database, light: light, dark: dark});
          }else{
            res.redirect('/dashboard');
          }
        });
      });
    } else {
      res.redirect('/dashboard');
    }
    }
  } else {
    res.redirect('/client');
  }
});

router.get('/dashboard/:port/configurator', function(req, res, next){
  if(req.session.loggedIn){
    if(req.params.port){
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      con.connect(function(err) {
        var sql = "SELECT server_owner, server_name, server_type, port, service_start, service_end, installedservices, memory, storage, shared_with, control_permission FROM `servers` WHERE `server_owner` = ? AND `port` = ? OR JSON_CONTAINS(shared_with, '[?]')  AND `port` = ?";
        con.query(sql, [req.session.userID, req.params.port, req.session.userID, req.params.port], function (err, result, fields) {
          if (err) throw err;
          Object.keys(result).forEach(function(key) {
           var row = result[key];
           if (req.session.profileDetails[7] == "light") {
             light = true;
             dark = false;
           }else{
             light = false;
             dark = true;
           }
           permissions = row.control_permission;
           teszt = JSON.parse(permissions);
           if (teszt[req.session.userID]["editconfig"] == "Y") {
             editconfig = true;
           }else{
             editconfig = false;
           }
           if (row.server_owner == req.session.userID) {
             owner = true;
             editconfig = true;
           }else{
             owner = false;
           }
           res.render('rootUI_dashboard/configurator', { title: "Dashboard - "+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, rootui: true, server_datas: result, light: light, dark: dark, editconfig: editconfig, owner: owner});
         });
        });
      });
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.redirect('/client');
  }
});

router.get('/dashboard/:port/filemanager', function(req, res, next){
  if(req.session.loggedIn){
    if(req.params.port){
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      con.connect(function(err) {
        var sql = "SELECT server_owner, server_name, server_type, port, service_start, service_end, installedservices, memory, storage, shared_with, control_permission FROM `servers` WHERE `server_owner` = ? AND `port` = ? OR JSON_CONTAINS(shared_with, '[?]')  AND `port` = ?";
        con.query(sql, [req.session.userID, req.params.port, req.session.userID, req.params.port], function (err, result, fields) {
          if (err) throw err;
          Object.keys(result).forEach(function(key) {
           var row = result[key];
           if (req.session.profileDetails[7] == "light") {
             light = true;
             dark = false;
           }else{
             light = false;
             dark = true;
           }
           permissions = row.control_permission;
           teszt = JSON.parse(permissions);
           if (teszt[req.session.userID]["filemanager"] == "Y") {
             filemanager = true;
           }else{
             filemanager = false;
           }
           if (row.server_owner == req.session.userID) {
             owner = true;
             filemanager = true;
           }else{
             owner = false;
           }
           res.render('rootUI_dashboard/filemanager', { title: "Dashboard - "+website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, rootui: true, server_datas: result, light: light, dark: dark, filemanager: filemanager, owner: owner});
         });
        });
      });
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.redirect('/client');
  }
});

// Global BackEnd varriables
const username_ = "hostservers";
const password_ = "Xapbanxd";
const hostname_ = "localhost";
const language_ = "utf8mb4";
const database_ = "hostservers";
// End of Global BackEnd varriables






// Recieve post requests and optimize their transfer.
function emailIsValid (email) {
  return /\S+@\S+\.\S+/.test(email);
}
function getID(username, nick, callback)
{
    var con = mysql.createConnection({
      host: hostname_,
      user: username_,
      password: password_,
      database: database_,
    });
    con.query('SELECT id FROM accounts WHERE nickName = ?', [nick], function(err, result)
    {
      callback(null,result[0].id);
    });
}
router.post('/sdashboard', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] == "true"){
      switch (req.body.type) {
        case "grantPerm":
          var user_id;
          var con = mysql.createConnection({
            host: hostname_,
            user: username_,
            password: password_,
            database: database_,
          });


          function update(shared_with, asd){
            con.query("UPDATE `servers` SET `shared_with` = '[?]' WHERE port=?", [shared_with, asd], function (error, results, fields) {
              if (error) {
                console.log(error);
              }else{
                console.log(shared_with);
                console.log("success");
                res.send("success");
              }
            });
          }

          con.connect(function(err) {
            var sql = "SELECT id FROM `accounts` WHERE `nickname` = ?";
            con.query(sql, [req.body.usr], function (err, result, fields) {
              if (err) throw err;
              if (result.length > 0) {
                let szamlalas = 0;
                Object.keys(result).forEach(function(key) {
                  var userdata = result[key];
                  user_id = userdata.id;
                  if (user_id == req.session.userID) {
                    res.send("cantaddyourself");
                  }else{
                    var sql = "SELECT shared_with,control_permission FROM `servers` WHERE `server_owner` = ? AND `port` = ? LIMIT 1";
                    con.query(sql, [req.session.userID, req.body.port], function (err, result, fields) {
                      if (err) throw err;
                      Object.keys(result).forEach(function(key) {
                        var data = result[key];
                        var shared_with = JSON.parse(data.shared_with);
                        if(shared_with != null){
                          if(!shared_with.includes(user_id)){
                            shared_with.push(user_id);
                            update(shared_with, Number(req.body.port));
                            var control_permission = JSON.parse(data.control_permission);
                            control_permission[user_id] = {
                              "stop": "N",
                              "start": "N",
                              "restart": "N",
                              "editconfig": "N",
                              "filemanager": "N",
                              "consolecommand": "N",
                              "reinstall": "N",
                              "database": "N"
                            }
                            console.log("CP: "+JSON.stringify(control_permission));
                            con.query("UPDATE `servers` SET control_permission = ? WHERE port=?", [JSON.stringify(control_permission), req.body.port], function (error, results, fields) {
                              if (error) {
                                console.log(error);
                              }else{
                                console.log(shared_with);
                                console.log("success");
                                console.log(szamlalas+1);
                              }
                            });
                          } else {
                            res.send("already");
                          }
                        } else {
                          shared_with = [user_id];
                          update(shared_with, Number(req.body.port));
                          var control_permission = {};
                          control_permission[user_id] = {
                            "stop": "N",
                            "start": "N",
                            "restart": "N",
                            "editconfig": "N",
                            "filemanager": "N",
                            "consolecommand": "N",
                            "reinstall": "N",
                            "database": "N"
                          }
                          console.log("CP: "+JSON.stringify(control_permission));
                          con.query("UPDATE `servers` SET control_permission = ? WHERE port=?", [JSON.stringify(control_permission), req.body.port], function (error, results, fields) {
                            if (error) {
                              console.log(error);
                            }else{
                              console.log(shared_with);
                              console.log("success");
                              console.log(szamlalas+1);
                            }
                          });
                        }
                      });
                    });
                  }
                });
              }else{
                res.send("notfound");
              }
            });
          });
          break;
        case "getPermissions":
        var con = mysql.createConnection({
          host: hostname_,
          user: username_,
          password: password_,
          database: database_,
        });
        var users = [];
        con.connect(function(err) {
          var sql = "SELECT shared_with FROM `servers` WHERE `server_owner` = ? AND `port` = ?";
          con.query(sql, [req.session.userID, req.body.port], function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
              Object.keys(result).forEach(function(key) {
                var data_ = result[key];
                if (data_.shared_with == null) {
                  users = {};
                }else{
                  for (var i = 0; i < data_.shared_with.length; i++) {
                    if (data_.shared_with[i] > 0) {
                      var sql = "SELECT nickName,id FROM `accounts` WHERE `id` = ?";
                      con.query(sql, [data_.shared_with[i]], function (err, results, fields) {
                        if (err) throw err;
                        Object.keys(results).forEach(function(key) {
                          var data = results[key];
                          users.push([{
                            'nick': data.nickName,
                            'id': data.id,
                          }]);
                        });
                      });
                    }
                  }
                }
              });
              setTimeout(function(){
                res.send(users);
              }, 100);
            }else{
              res.send("noshare");
            }
          });
        });
          break;
        case "removePerm":
          var teszt = getID("",req.body.usr, function(err,data_____){
            if (err) {
              console.log("ERROR : ",err);
            } else {
              var con = mysql.createConnection({
                host: hostname_,
                user: username_,
                password: password_,
                database: database_,
              });
              var newShare = [];
              con.query(`SELECT shared_with FROM servers WHERE port = ? AND server_owner = ?`, [req.body.port, req.session.userID], function (error, results, fields) {
                if (error) {
                  console.log(error);
                }else{
                  Object.keys(results).forEach(function(key) {
                    var data = results[key];
                    var test = JSON.parse(data.shared_with);
                    for (let i = 0; i < test.length; i++) {
                      console.log(test[i]+" == "+data_____);
                      if (test[i] == data_____) {

                      }else{
                        newShare.push(test[i]);
                      }
                    }
                  });
                  con.query(`UPDATE servers SET shared_with = '[?]' WHERE port=?`, [newShare, req.body.port], function (error, results, fields) {
                    console.log(newShare);
                    if (error) {
                      console.log(error);
                    }else{
                      res.send("success");
                    }
                  });
                }
              });
            }
          });
          break;
        case "getPermissionDetails":
          // JSON_CONTAINS(shared_with, '[?]')
          var con = mysql.createConnection({
            host: hostname_,
            user: username_,
            password: password_,
            database: database_,
          });
          con.query(`SELECT control_permission FROM servers WHERE port = ? AND server_owner = ?`, [req.body.port, req.session.userID], function (error, results, fields) {
            if (error) {
              console.log(error);
            }else{
              Object.keys(results).forEach(function(key) {
                var data = results[key];
                var test = JSON.parse(data.control_permission);
                console.log(test);
                res.send(test);
              });
            }
          });
          break;
        case "savePerm":
          var con = mysql.createConnection({
            host: hostname_,
            user: username_,
            password: password_,
            database: database_,
          });
          con.query(`SELECT control_permission FROM servers WHERE port = ? AND server_owner = ?`, [req.body.port, req.session.userID], function (error, results, fields) {
            if (error) {
              console.log(error);
            }else{
              Object.keys(results).forEach(function(key) {
                var data = results[key];
                var test = JSON.parse(data.control_permission);
                console.log(test[req.body.usr]);
                test[req.body.usr] = JSON.parse(req.body.perms);
                console.log(test[req.body.usr]);
                var newarray = JSON.stringify(test);
                con.query(`UPDATE servers SET control_permission = ? WHERE port=? AND server_owner = ?`, [newarray, req.body.port, req.session.userID], function (error, results, fields) {
                  if (error) {
                    console.log(error);
                  }else{
                    res.send("success");
                    console.log("Updated: "+newarray);
                  }
                });
              });
            }
          });
          break;
        default:
        res.send("Invalid argument");
      }
    } else {
      res.send("notverified");
    }
  } else {
    res.send("not_authorized.");
  }
});
router.post('/order', function(req, res, next){
  switch (req.body.type) {
      case "viprank":
      if(req.session.loggedIn){
      var acceptNewProductOrders = false;
      var defPrice = 20;
      var percentage;
      var full_name = req.body.full_name;
      var zip_code = req.body.zip_code;
      var street_address = req.body.street_address;
      var country_city = req.body.country_city;
      var whichProduct = req.body.whichProduct;
      var sweater_Color = req.body.sweater_Color;
      var product_Size = req.body.product_Size;
      var quantity = req.body.quantity;
      var pHnUmber = req.body.pHnUmber;
      if(full_name.length < 10 || zip_code.length < 3 || street_address.length < 5 || country_city.length < 5 || pHnUmber.length < 5){
        res.send('invalid_informations');
      } else {
        if(quantity > 1){
          if(quantity == 2){
            percentage = (quantity/10);
            var newPrice = ((defPrice*quantity)-(defPrice*quantity)*percentage);
          } else if(quantity == 3){
            percentage = (quantity/10);
            var newPrice = ((defPrice*quantity)-(defPrice*quantity)*percentage);
          } else if(quantity == 4){
            percentage = (quantity/10);
            var newPrice = ((defPrice*quantity)-(defPrice*quantity)*percentage);
          }
        } else {
          percentage = 0;
          var newPrice = defPrice;
        }
        if(zip_code.length > 10){
          res.send("Invalidzip");
        } else if(pHnUmber.length > 110){
          res.send("Invalidphone");
        } else if(quantity.length > 1){
          res.send("Invalidquantity");
        } else if(isNaN(zip_code)){
          res.send("Invalidzip");
        } else if(whichProduct != "sweater" && whichProduct != "tshirt"){
          res.send("invalidproduct");
        } else if(sweater_Color.length > 80){
          res.send("invalid_sweater_color");
        } else {
          // Start ordering
          var con = mysql.createConnection({
            host: hostname_,
            user: username_,
            password: password_,
            database: database_,
          });
          con.query('SELECT balance, vip FROM accounts WHERE id = ? LIMIT 1', [req.session.userID], function (error, results, fields) {
            if (error) throw error;
            Object.keys(results).forEach(function(key) {
              var user_datas = results[key];
              if(user_datas.vip){
                res.send("youalreadyhaveit");
              } else {
              if(user_datas.balance >= newPrice){
                req.session.profileDetails[2] = user_datas-newPrice;
                con.query('UPDATE accounts SET balance=balance -?, loyalityCredits=loyalityCredits +?, vip=? WHERE id = ?', [newPrice, 100, true, req.session.userID], function (error, results, fields) {
                  if (error) throw error;
                    con.query('INSERT INTO product_orders (full_name, zip_code, street_address, country_city, whichProduct, sweater_Color, product_Size, quantity, pHnUmber, issuedby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [full_name, zip_code, street_address, country_city, whichProduct, sweater_Color, product_Size, quantity, pHnUmber, req.session.userID], function (error, results, fields) {
                      if (error) throw error;
                      var transaction_ID = randomstring.generate(91);
                      con.query('INSERT INTO transactions (owner, transaction_name, transaction_id, transaction_type, transaction_worth) VALUES (?, ?, ?, ?, ?)', [req.session.userID, 'Become V.I.P', transaction_ID, 'purchased', newPrice], function (error, results, fields) {
                        if (error) throw error;
                        res.send("ordered");
                        con.end();
                      });
                    });
                });
              } else {
                con.end();
                res.send("notenoughtmoney");
              }
            }
            });
          });
          // End of ordering
        }
      }
    } else {
      res.send("notloggedIn");
    }
      break;
      case "order_server_procs":
      var response_ = [{
        'stat': '',
        'message': '',
      }];
      if(req.session.loggedIn){
        if(req.session.profileDetails[4] == "true"){
          response_[0]['stat'] = "It was success!";
          response_[0]['message'] = "Success!";
          res.send(response_);
        } else {
          response_[0]['stat'] = "You are not verified!";
          response_[0]['message'] = "Please verify your account to ";
          res.send(response_);
        }
      } else {
        response_[0]['stat'] = "Not logged in!";
        response_[0]['message'] = "You must sign in to perform this action!";
        res.send(response);
      }
      break;
    default:
    res.send("Invalid request");
  }
});

router.post('/knowledgebase', function(req, res, next){
  if(req.session.loggedIn){
    if(req.session.profileDetails[4] == "true"){
      switch (req.body.OP) {
        case "shareNew_POST":
          res.send(knowledgebase_network.share_post(req.body.keywords, req.body.category, req.body.question, req.body.description, req.body.hidename, req.session.userID));
        break;
        default:
        res.send("Invalid arguments");
      }
    } else {
      res.send("notverified");
    }
  } else {
    res.send('accessdenied');
  }
});

router.post('/pr', function(req, res, next){
  switch (req.body.type) {
    case "reg":
    var email = req.body.email;
    var password = req.body.pass;
    var re_password = req.body.repass;
    var nickname = req.body.nickname;
    if(emailIsValid(email)){
      if (password.length >= 6) {
        if (password == re_password) {
          regexp = /^[A-Z]/;
          if (regexp.test(password)){
            var con = mysql.createConnection({
              host: hostname_,
              user: username_,
              password: password_,
              database: database_,
            });
            password = md5(password);
              con.connect(function(err) {
                var sql = "SELECT * FROM `accounts` WHERE `email` = ?";
                con.query(sql, [email], function (err, result, fields) {
                  if (err) throw err;
                  if(result.length > 0){
                    res.send("usedemail");
                    return false;
                  }else{
                    var sql = "SELECT * FROM `accounts` WHERE `nickname` = ?";
                    con.query(sql, [nickname], function (err, result, fields) {
                      if (err) throw err;
                      if(result.length > 0){
                        res.send("usednickname");
                        return false;
                      }else{
                        var sql = "INSERT INTO accounts (email, pwd, nickname, balance) VALUES (?, ?, ?, ?)";
                        con.query(sql, [email, password, nickname, 0], function (err) {
                          if (err) throw err;
                          res.send("success");
                          con.end(function(err) {
                            if(err) {

                            }
                          });
                        });
                      }
                    });
                  }
                });
              });
          } else{
            res.send("doesntmatchrequirementsofpassword");
          }
        } else {
          res.send("nomatch");
        }
      } else {
        res.send("doesntmatchrequirementsofpassword");
      }
    } else {
      res.send("invalidemail");
    }
    break;
    case "log":
    var email = req.body.email;
    var password = req.body.password;
    var bcryptpassword = md5(password);
    var con = mysql.createConnection({
      host: hostname_,
      user: username_,
      password: password_,
      database: database_,
    });
    con.connect(function(err) {
      con.query('SELECT * FROM accounts WHERE email = ? AND pwd = ? LIMIT 1', [email, bcryptpassword], function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0){
          Object.keys(results).forEach(function(key) {
           var row = results[key];
           if(row.blocked == "allowed"){
             req.session.loggedIn = true;
             req.session.userID = row.id;
             req.session.nickName = row.nickname;
             regdate = dateFormat(row.regdate, "mmm d, yyyy h:MM TT");
             //regdate = row.regdate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
             req.session.profileDetails = [regdate, row.loyalityCredits, row.balance, row.email, row.verified, row.phonenumber, row.vip, row.admin_theme];
             res.send("success");
           } else {
             res.send("blocked");
           }
         });
        } else {
          res.send("invaliddatas");
        }
      });
      con.end(function(err) {
        if(err) {

        }
      });
    });
    break;
    case "data_acc":
    var con = mysql.createConnection({
      host: hostname_,
      user: username_,
      password: password_,
      database: database_,
    });

    con.connect(function(err) {
      con.query('SELECT * FROM accounts WHERE id = ? LIMIT 1', [req.session.userID], function (error, results, fields) {
      if (error) throw error;
        Object.keys(results).forEach(function(key) {
          var row = results[key];
          regdate = row.regdate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          req.session.profileDetails = [regdate, row.loyalityCredits, row.balance, row.email, row.verified, row.phonenumber, row.vip, row.admin_theme];
          res.send(req.session.profileDetails);
        });
      });
      con.end(function(err) {
        if(err) {

        }
      });
    });
    break;
    case "getStateE":
    var con = mysql.createConnection({
      host: hostname_,
      user: username_,
      password: password_,
      database: database_,
    });
    con.connect(function(err) {
      var sql = "SELECT server_owner, server_name, server_type, port, service_start, service_end, installedservices, memory, storage, shared_with FROM `servers` WHERE `server_owner` = ? AND server_type = ? OR JSON_CONTAINS(shared_with, '[?]') AND server_type = ?";
      con.query(sql, [req.session.userID, req.body.server_type, req.session.userID, req.body.server_type], function (err, result, fields) {
        if (err) throw err;
          console.log(result);
        if (result.length > 0) {
          Object.keys(result).forEach(function(key) {
            var row = result[key];
            if (row.server_owner == req.session.userID) {
              ress = {
                "server_name" : row.server_name,
                "server_type" : row.server_type,
                "port" : row.port,
                "service_start" : row.service_start,
                "service_end" : row.service_end,
                "installedservices" : row.installedservices,
                "memory" : row.memory,
                "storage" : row.storage,
                "shared_with" : false
              }
            }else{
              ress = {
                "server_name" : row.server_name,
                "server_type" : row.server_type,
                "port" : row.port,
                "service_start" : row.service_start,
                "service_end" : row.service_end,
                "installedservices" : row.installedservices,
                "memory" : row.memory,
                "storage" : row.storage,
                "shared_with" : row.shared_with
              }
            }
          });
          res.send([ress]);
        }
      });
      con.end(function(err) {
        if(err) {

        }
      });
    });
    break;
    case "validatePhone":
    if(req.body.pNumber == ""){
      res.send('emptyfield');
    } else {
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      var sms_text = randomstring.generate(7);
      // Black list phone numbers
      var phone_blacklist = [911, 107, 112, 104, 105];
      var stat_of_blacklist = phone_blacklist.includes(req.body.pNumber);
      // End of blacklist phone numbers
      if(stat_of_blacklist === true){
        res.send("on_blacklist");
      } else {
        con.query('SELECT id FROM accounts WHERE phonenumber = ? AND verified = ? AND blocked = ?', [req.body.pNumber, "true", "allowed"], function (error, results, fields) {
          if (error) throw error;
          if(results.length == 0){
            con.query('UPDATE accounts SET verified = ? WHERE id=?', [sms_text, req.session.userID], function (error, results, fields) {
              if (error) throw error;
              req.session.temporaryPhone = req.body.pNumber;
              // Nexmo API
              const nexmo = new Nexmo({
                apiKey: 'ca2ee72a',
                apiSecret: 'xZ2IpOudLSNeRXWO',
              });

              const from = 'HostServers.pro';
              const to = req.body.pNumber;
              const text = 'Your HostServers.pro confirmation code: '+sms_text+'\nIf you did not sign up, ignore the SMS.';

              nexmo.message.sendSms(from, to, text);
              // End of Nexmo API
              res.send('sent');
            });
            con.end(function(err) {
              if(err) {

              }
            });
          } else {
            res.send("alreadyinuse");
          }
        });
      }
    }
    break;
    case "verifyPhone":
    if(req.body.acCode == ""){
      res.send('emptyfield');
    } else {
      var con = mysql.createConnection({
        host: hostname_,
        user: username_,
        password: password_,
        database: database_,
      });
      con.query('SELECT id FROM accounts WHERE id = ? AND verified = ?', [req.session.userID, req.body.acCode], function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0){
          con.query('UPDATE accounts SET verified = ?, phonenumber = ? WHERE id = ?', ["true", req.session.temporaryPhone, req.session.userID], function (error, results, fields) {
            if (error) throw error;
            req.session.temporaryPhone = false;
            // Updating profileDetails ARRAY
            con.query('SELECT * FROM accounts WHERE id = ? LIMIT 1', [req.session.userID], function (error, results, fields) {
            if (error) throw error;
              Object.keys(results).forEach(function(key) {
                var row = results[key];
                regdate = row.regdate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                req.session.profileDetails = [regdate, row.loyalityCredits, row.balance, row.email, row.verified, row.admin_theme];
                res.redirect('/account');
              });
            });
            // End of Updating profileDetails ARRAY
            con.end(function(err) {
              if(err) {

              }
            });
          });
        } else {
          res.send("invalidcode");
        }
      });
    }
    break;
    default:
      res.send("Invalid request");
  }
});







// NodeJS instead of htaccess
router.use(function(req, res) {
 res.status(400);
 res.render('error', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, message: "The page you were looking for was not found, probably it was deleted or moved to another address."});
});

router.use(function(req, res) {
 res.status(500);
 res.render('error', { title: website_title, notification: false, menu: menu, uptotal: uptotal, menulink: menulink, theme: "custom", loggedIn: req.session.loggedIn, nickName: req.session.nickName, profileDetails: req.session.profileDetails, message: "You're not authorized to view this page."});
});

module.exports = router;
