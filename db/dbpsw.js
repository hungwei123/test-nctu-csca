var Client = require('mariasql');
var genericPool = require('generic-pool');

const factory = {
    name: 'cadb',
    create: function() {
        return new Promise(function(resolve, reject) {
            var c = new Client({
                host: '140.113.168.202',
                user: 'ca',
                password: 'nctucscadb',
                db: 'ca',
                charset: 'utf8'
            });
            c.connect();
            c.on('ready', function() {
                resolve(c);
            });
        });
    },
    destroy: function(client){
        return new Promise(function(resolve){
          client.on('end', function(){  
            resolve();
          })
          client.end();
        })
    }
};

var opts = {
    max: 30,
    min: 2,
    idleTimeoutMillis: 18000,
    evictionRunIntervalMillis:18000
};

var pool = genericPool.createPool(factory, opts);

module.exports.dbpsw = function(){

  return pool;

};
