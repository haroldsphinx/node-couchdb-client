/**
 * Created by charles<sealcharles@gmail.com> 
 */
var dotenv = require("dotenv").config()
var restify = require('restify')
var _config = require('./config/app.js')
var unirest = require('unirest');
var Resp = require("./helpers/Response");
var nano = require("nano")('http://'+_config.couchdb.username+':'+_config.couchdb.password+'@'+_config.couchdb.host+':'+_config.couchdb.port);
// var nano = require("nano")(_config.couchdb.host+':'+_config.couchdb.port); 
 

_config.couchdb.username

var api_url = _config.app_name+_config.api._url+_config.api._version;

var server = restify.createServer({name: _config.app_name});

server.pre(restify.pre.sanitizePath());


var resp = function(res,data){
    res.header("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(data))
};


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


server.listen(_config.api._port, function () {
    console.log('%s listening at %s', server.name, server.url+'/'+api_url);
});



server.get(api_url+"/", function (req, res) {
    resp(res, Resp.success({msg:'This service returns iso codes for any given country'}))
})


server.get(api_url+"/create_database",  function (req, res) {
    var dbname = req.params["dbname"];

    console.log(dbname)

    if (dbname == 'undefined') return resp(res, Resp.error({msg: "Please provide database name"}))

    nano.db.create(dbname, function(err, body, header){
        if (err)
            return resp(res, Resp.error({msg: "Unable to create database", resp: err}))
        else
            return resp(res, Resp.success({msg: "Database created", resp: body}))
    })
})

server.get(api_url+"/get_country_code", function (req, res) {

    var search = req.params["search"];

    if (!search) resp(res, Resp.error({msg: "Please provide search parameter"}))

    var param = {country: search}

    console.log(param)

    var countries = nano.use(_config.couchdb.db_name);

    countries.fetch(param, function(err, data){
        if (err)
            return resp(res, Resp.error({msg: "Unable to get details", resp: err}))
        else
            return resp(res, Resp.success({msg: "Ok", resp: data}))
    } )
})



server.get(api_url+"/add_country_code", function (req, res) {
    var country = req.params["country"];
    var country_code = req.params["country_code"];
    var error = [];

    console.log(country, country_code)
    
    if (!country || country == 'undefined') error.push('Country Missing');
    if (!country_code || country_code.length == 'undefined') error.push('Country Code Missing');
    
    if (error.length == 0){
        var param = {country: country, country_code: country_code}
        nano.use(_config.couchdb.db_name).insert(param, function(err, body){
            if (err) return resp(res, Resp.error({msg: "Error inserting into database", resp: err}))
            else return resp(res, Resp.success({msg: "COuntry record successfully added into database", resp: body}))
        })             
    }
    else 
        return res.send(Resp.error({msg: error}));
})


