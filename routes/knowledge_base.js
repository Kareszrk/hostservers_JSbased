const express = require('express');
const mysql = require('mysql');
const md5 = require('md5');
const randomstring = require('randomstring');
const Nexmo = require('nexmo');
const dateFormat = require('dateformat');
const now = new Date();

// Global BackEnd varriables
const username_ = "hostservers";
const password_ = "Xapbanxd";
const hostname_ = "localhost";
const language_ = "utf8mb4";
const database_ = "hostservers";
// End of Global BackEnd varriables

// Array return value in any case if it's needed.
var response = [{
  "stat": "processing",
  "message": "",
}];
// Functions based to serve core
function setResponse(stat, message){
  response[0]['stat'] = stat;
  response[0]['message'] = message;
  return true;
}


// ONE TIME-USED FUNCTIONS FOR FUNCTIONS
function getknowledgeBy_identifier(identifier){
  var con = mysql.createConnection({
    host: hostname_,
    user: username_,
    password: password_,
    database: database_,
  });
  con.query('SELECT id FROM knowledgebase WHERE know_identifier = ? LIMIT 1', [identifier], function (error, results, fields) {
  if (error) throw error;
  if(results.length > 0){
    return true;
  } else {
    return false;
  }
  });
  con.end();
}
// END - ONE TIME USED FUNCTIONS FOR FUNCTIONS



// Callable functions that may issued by other files
module.exports.share_post = function share_post(keywords, category, question, description, hidename, userID){
  if(keywords.length > 0 && category.length > 0 && question.length > 0){
    var acceptable_categories = ["Minecraft JAVA - Dashboard", "Minecraft JAVA - Plugins", "Minecraft Bedrock - Dashboard", "Minecraft Bedrock - Plugins", "Report a bug/glitch", "SMS server", "API server", "API coding", "Payment by balance", "Payment by credit card"];
    if(acceptable_categories.includes(category)){
      if(category == "Report a bug/glitch"){
        setResponse('Not reciving errors!', 'We are not reciving errors on the forum. If you have found any, please write us an email!');
        return response;
      } else {
        var con = mysql.createConnection({
          host: hostname_,
          user: username_,
          password: password_,
          database: database_,
        });
        // Multithreading
        if(hidename == "on"){
          hidename = true;
        } else {
          hidename = false;
        }
         var knowledgebase_page_identifier = randomstring.generate(6);
         while(getknowledgeBy_identifier()){
           knowledgebase_page_identifier = randomstring.generate(6);
         }
         con.query('INSERT INTO knowledgebase (question, description, keywords, category, owner, hide_name, delete_period, know_identifier) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), ?)', [question, description, keywords, category, userID, hidename, knowledgebase_page_identifier], function (error, results, fields) {
           if (error) throw error;
           setResponse("success", "/knowledgebase/"+knowledgebase_page_identifier);
         });
         con.end();
         return response;
      }
    } else {
      setResponse('Invalid category!', 'The category you have selected does not exist.');
      return response;
    }
  } else {
    return response;
  }
}
