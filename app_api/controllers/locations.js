
var mongoose = require('mongoose');
var modelLocation = mongoose.model("Location");
var modelCoordinate = mongoose.model("Coordenate");


var sendJsonResponse = function (res, status, content){

    res.status(status);
    res.json(content);

};

// http://localhost:3000/api.loc8r.com/locations
module.exports.locationsCreate = function(req, res) {
    
    modelLocation.create({
        name : req.body.name,
        address : req.body.address,
        facilities : req.body.facilities.split(","),
        coords : [ parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes : [{ 
            days    : req.body.days1,
            opening : req.body.opening1,
            closing : req.body.closing1,
            closed  : req.body.closed1,
        },{
            days    : req.body.days2,
            opening : req.body.opening2,
            closing : req.body.closing2,
            closed  : req.body.closed2,

        }]

    },function(err, location){
        if(err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res, 201, location);
        }
    });

};
/**
 *
 * http://localhost:3000/api.loc8r.com/coordenates?lng=-48.023911099999964&lat=-15.83813799&maxDistance=100
 *  
 */

module.exports.coordenatesListByDistance = function(req, res, next) {
    
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseInt(req.query.maxDistance);

    var point = {
        type: "Point",
        coordinates : [lng , lat]
   };

   var geoOptions = {
       spherical : true, // se estiver usando indice 2dsphere : vide locationSchema
       num: 10,
       maxDistance: maxDistance 
   }

   if(!lng || !lat || !maxDistance){

       sendJsonResponse(res,404, { "message" :"lng and lat and maxDistance shoud be provided"});
   }

   var theEarth = (function(){ // mongo 3 e mongoose 4 usa metro obrigatoriamente em maxDistance / função para conhecimento

       var earthRadius = 6371; // valor em km, em minhas seria 3959
       var getDistanteFromRads = function(rads){
           return parseFloat(rads * earthRadius); // converte radianos em metros
       };
       var getRadsFromDistance = function(distance){
           return parseFloat(distance/earthRadius);
       };

       return {

           getDistanteFromRads : getDistanteFromRads,
           getRadsFromDistance : getRadsFromDistance

       };

   })();

   modelCoordinate.geoNear(point, geoOptions, function(err, results, stats){
       if(err){
          sendJsonResponse(res,404,err);
          return;
       }
       else{

               var coordenates = [];

                results.forEach(function (doc){
                    coordenates.push({
                    name : doc.obj.name,
                    _id: doc.obj._id,  
                    distance: doc.dis
                    });
                });

                sendJsonResponse(res,200,coordenates);

           }
       
   });

};

/**
 * http://localhost:3000/api.loc8r.com/locations?lng=-48.023911099999964&lat=-15.83813799&maxDistance=100
 * 
 * */
module.exports.locationsListByDistance = function(req, res, next) {
    
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseInt(req.query.maxDistance);

    var point = {
        type: "Point",
        coordinates : [lng , lat]
   };

   var geoOptions = {
       spherical : true, // se estiver usando indice 2dsphere : vide locationSchema
       num: 10,
       maxDistance: maxDistance 
   }

   if(!lng || !lat || !maxDistance){

       sendJsonResponse(res,404, { "message" :"lng and lat and maxDistance shoud be provided"});
   }

   var theEarth = (function(){ // mongo 3 e mongoose 4 usa metro obrigatoriamente em maxDistance / função para conhecimento

       var earthRadius = 6371; // valor em km, em minhas seria 3959
       var getDistanteFromRads = function(rads){
           return parseFloat(rads * earthRadius); // converte radianos em metros
       };
       var getRadsFromDistance = function(distance){
           return parseFloat(distance/earthRadius);
       };

       return {

           getDistanteFromRads : getDistanteFromRads,
           getRadsFromDistance : getRadsFromDistance

       };

   })();

   modelLocation.geoNear(point, geoOptions, function(err, results, stats){
       if(err){
          sendJsonResponse(res,404,err);
          return;
       }
       else{

               var locations = [];

                results.forEach(function (doc){
                    locations.push({
                    name : doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id,  
                    distance: doc.dis
                    });
                });
                sendJsonResponse(res,200,locations);

           }
       
   });

};

module.exports.locationsReadOne = function(req, res, next) {
    if(req.params && req.params.locationId){
       modelLocation.findById(req.params.locationId)
       .select("name , reviews")
       .exec(function (err, location){
            if(!location){
                    sendJsonResponse(res,404,{"message" : "locationid not found."});
                    return;                         
            }else if (err){
                    sendJsonResponse(res,404,err);
                    return;
            }
            sendJsonResponse(res,200,location);
        });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};

module.exports.locationsUpdateOne = function(req, res, next) {
    
    if(req.params && req.params.locationId){
       modelLocation.findById(req.params.locationId)
       .select("name , reviews")
       .exec(function (err, location){
            if(!location){
                    sendJsonResponse(res,404,{"message" : "locationid not found."});
                    return;                         
            }else if (err){
                    sendJsonResponse(res,404,err);
                    return;
            }
            else{
                
                location.name = req.body.name;
                location.address = req.body.address;
                location.facilities = req.body.facilities.split(",");
                location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
                location.openingTimes = [{ 
                    days    : req.body.days1,
                    opening : req.body.opening1,
                    closing : req.body.closing1,
                    closed  : req.body.closed1,
                },{
                    days    : req.body.days2,
                    opening : req.body.opening2,
                    closing : req.body.closing2,
                    closed  : req.body.closed2,
               }];

               location.save(function(err,location){
                   if(err){
                       sendJsonResponse(res,404,err);
                        return;
                   }else{

                       sendJsonResponse(res,200,location);

                   }

               });
                
            }
            
        });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};

module.exports.locationsDeleteOne = function(req, res) {
    
    if(req.params && req.params.locationId){
       modelLocation.findById(req.params.locationId)
       .exec(function (err, location){
            if(!location){
                    sendJsonResponse(res,404,{"message" : "locationid not found."});

            }else if (err){
                    sendJsonResponse(res,404,err);

            }else{

                modelLocation.remove({_id: location._id} ,function (err, location){

                    if (err){
                        sendJsonResponse(res,404,err);

                    }else{
                        sendJsonResponse(res,204,location);

                    }

                });

            }
        });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }

};