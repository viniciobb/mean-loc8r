
var mongoose = require('mongoose');
var gracefulShutDown;
var dbURI = 'mongodb://localhost:27017/loc8r';
if(process.env.NODE_ENV == "production")
    dbURI= process.env.MONGOLAB_URI;
var readline = require('readline');
mongoose.connect(dbURI);

mongoose.connection.on('connected',function(){
    console.log("Mongoose connected to :" + dbURI);
    console.log("Platform : " + process.platform);
    if(process.platform ==="win32"){
        var rl = readline.createInterface(
        {   input : process.stdin,
            output : process.stdout      
        });
        
        rl.on("SIGINT",function(){
            process.emit("SIGINT");
            console.log("emmited SIGINT");
        });

        rl.on("SIGUSR2",function(){
            process.emit("SIGUSR2");
            console.log("emmited SIGUSR2");
        });

        rl.on("SIGTERM",function(){
            process.emit("SIGTERM");
            console.log("emmited SIGTERM");
        });

    }else{
        console.log(process.platform);
    }

});

mongoose.connection.on('error',function(err){
    console.log("Mongoose connection error : " + err);
});

mongoose.connection.on('disconnect',function(){
    console.log("Mongoose disconnected.");
});

gracefulShutDown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected trough"+ msg);
        callback();            
    });
};

process.once('SIGUSR2',function(){
    gracefulShutDown('nodemon restart',function(){
        process.kill(process.pid, 'SIGUSR2');
    });

});

process.once('SIGINT',function(){
    gracefulShutDown('app termination',function(){
        process.exit(0);
    });

});


process.once('SIGTERM',function(){
    gracefulShutDown('Heroku app shutdown',function(){
        process.exit(0);
    });

});

require('./locations');

