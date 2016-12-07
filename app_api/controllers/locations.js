
var mongoose = require('mongoose');

var modelLocation = mongoose.model("Location"); 

var sendJsonResponse = function (res, status, content){

    res.status(status);
    res.json(content);

};


module.exports.locationsCreate = function(req, res, next) {
    
    sendJsonResponse(res,200,{"status": "success"});

};

module.exports.locationsListByDistance = function(req, res, next) {
    
    sendJsonResponse(res,200,{"status": "success"});

};

module.exports.locationsReadOne = function(req, res, next) {
    
    if(req.params && req.params.locationId){

        modelLocation.findById(req.params.locationId)
                 .exec(function (err, location){
                     if(!location){
                        sendJsonResponse(res,404,{"message" : "locationid not found."});
                        return;                         
                     }else if (err){
                         sendJsonResponse(res,404,err);
                         return;
                     }
                     console.log("location.reviews[0].id");
                     console.log(location.reviews[0].id);
                     sendJsonResponse(res,200,location);
                 });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};

module.exports.locationsUpdateOne = function(req, res, next) {
    
    sendJsonResponse(res,200,{"status": "success"});
};

module.exports.locationsDeleteOne = function(req, res, next) {
    
    sendJsonResponse(res,200,{"status": "success"});

};