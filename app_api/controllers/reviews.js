var mongoose = require('mongoose');
var modelLocation = mongoose.model("Location"); 

var sendJsonResponse = function (res, status, content){

    res.status(status);
    res.json(content);

};

var doSetAverageRating = function(location){

    
    var ratingTotal = 0, average, i;

    if( location.reviews && location.reviews.length > 0){
        
        for(i=0;i<location.reviews.length;i++){
            ratingTotal =  location.reviews[i].rating + ratingTotal;               
        }

        console.log("ratingTotal "+ratingTotal);

        average = parseInt(ratingTotal / location.reviews.length,10); 

        console.log(typeof(average));

        location.rating = average;

        location.save(function(err,location){
            if(err){
                console.log(err);                
            }else{
                console.log("location updated with the rating "+ average );
            }
        });

    }



};

var updadeAverageRating = function(locationId){

    if(locationId){

        modelLocation.findById(locationId)
        .exec(
            function(err, location){
                if(!err){
                    doSetAverageRating(location);
                }

            });

    } else{
        sendJsonResponse(res,404, { "message" : "Not found, locationID required"} );
    }   


};



var doAddReview = function(req,res,location){

    /*
        author: String,
        rating: {type: Number , 'default': 0 , min: 0 , max: 5},
        reviewText: String,
        createOn: {type: Date, "default": Date.now}
    */
    if(!location){
        sendJsonResponse(res,404, { "message" : "Not found, locationID required"} );
     }else{

        location.reviews.push({
            author : req.body.author,
            rating : req.body.rating,
            reviewText : req.body.reviewText,
        });
        location.save(function(err,location){
            var thisReview;
            if(err){
                sendJsonResponse(res,404,err);                
            }else{
                updadeAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res,200,thisReview);
            }
        });


     }
};                    

module.exports.reviewsCreate = function(req, res) {
    

    var locationId = req.params.locationId; 
    if(locationId){

        modelLocation.findById(locationId)
        .select('reviews')
        .exec(
            function(err, location){
                if(err){
                   sendJsonResponse(res,400,err);
                }else{
                    doAddReview(req,res,location);                    
                }

            }
        );

    } else{
        sendJsonResponse(res,404, { "message" : "Not found, locationID required"} );
    }   

};

module.exports.reviewsReadOne = function(req, res) {
   
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
                            review.author = req.body.author;
                            review.rating = req.body.rating;
                            review.reviewText = req.body.reviewText;
                            location.save(function(err,review){
                                if(err){
                                    sendJsonResponse(res,404,err);
                                    return;
                                 }else{
                                     updadeAverageRating(location._id);
                                     sendJsonResponse(res,200,review);
                                 }
                            })
                         }
                     }else{
                         sendJsonResponse(res,404,{"message" : "Reviews not found"});
                     }                     
                 });

    }else{
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};

module.exports.reviewsDeleteOne = function(req, res, next) {
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
                            
                            location.reviews.id(req.params.reviewId).remove();
                            location.save(function(err){
                                if(err){
                                    sendJsonResponse(res,404,err);
                                    return;

                                }else{

                                    updadeAverageRating(location._id);
                                    sendJsonResponse(res,200,location);

                                }

                            });

                         }
                     }else{

                         sendJsonResponse(res,404,{"message" : "Reviews not found"});

                     }                     


                 });

    }else{
        
        sendJsonResponse(res,404,{"message" : "No locationid in request."});        
    }
};