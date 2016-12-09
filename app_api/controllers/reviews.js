/*
router.post('/locations/:locationsId/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewsDeleteOne);

*/

var mongoose = require('mongoose');
var modelLocation = mongoose.model("Location"); 

var sendJsonResponse = function (res, status, content){

    res.status(status);
    res.json(content);

};

module.exports.reviewsCreate = function(req, res, next) {
    sendJsonResponse(res,200,{"status": "success"});
};

module.exports.reviewsReadOne = function(req, res, next) {
    if(req.params && req.params.locationId && req.params.reviewId){

        modelLocation.findById(req.params.locationId,
                 function (err, location){
                     var response, review; 
                     if(!location){
                        sendJsonResponse(res,404,{"message" : "locationid not found."});
                        return;                         
                     }else if (err){
                         sendJsonResponse(res,404,err);
                         return;
                     }
                     if(location.reviews && location.reviews.length > 0){
                         review = location.reviews.id(req.params.reviewId);
                         if(!review){
                             sendJsonResponse(res,404,{"message" : "reviewid "+req.params.reviewId+" not found."});
                         }else{
                            response = {

                                location : {

                                    name : location.name,
                                    id : req.params.locationId

                                },
                                review : review
                            };

                            sendJsonResponse(res,200,response);

                         }
                     }else{

                         sendJsonResponse(res,404,{"message" : "Reviews not found"});

                     }                     


                 });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};

module.exports.reviewsUpdateOne = function(req, res, next) {
    sendJsonResponse(res,200,{"status": "success"});
};

module.exports.reviewsDeleteOne = function(req, res, next) {
    sendJsonResponse(res,200,{"status": "success"});
};