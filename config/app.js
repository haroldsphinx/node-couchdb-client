'use strict'

const config = {
    "app_name":"Node-CouchDb-Client",
    "app_version":"1.0.0",
    "app_url":"127.0.0.1",
    "app_base": "/",
    "init_port":4560,
    "api":{
        "_url":"/api",
        "_version":"/1.0",
        "_port":4561
    },
    "couchdb":{
        "host":"127.0.0.1",
        "port":"5984",
        "username":"admin",
        "password": "admin",
        "db_name": "countries"
    },
}

module.exports = config;