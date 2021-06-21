const mysql = require("mysql");
const md5 = require('md5');
const randomstring = require('randomstring');

// Global BackEnd varriables
const username_ = "hostservers";
const password_ = "Xapbanxd";
const hostname_ = "localhost";
const language_ = "utf8mb4";
const database_ = "hostservers";
// End of Global BackEnd varriables

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

//call Fn for db query with callback

module.exports.getIDByNick = function getIDByNick(nick, done) {
  var userid;
  getID("",nick, function(err,data){
    if (err) {
      console.log("ERROR : ",err);
    } else {
      console.log("result from db is : ",data);
      return "asd";
    }
  });
};
