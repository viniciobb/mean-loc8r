
/* GET 'home' page using index extending layout*/

var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
  
if(process.env.NODE_ENV=="production")
  apiOptions.server = "https://lit-harbor-36974.herokuapp.com";


module.exports.homeList = function(req, res, next) {
  var reqOptions, path;
  
  path="/api.loc8r.com/locations";

  requestOptions = {
    url : apiOptions.server+path,
    method : "get",
    json:{},
    qs: { 
      lng : -48.02281469,
      lat : -15.83892242,
      maxDistance : 10
    }

  };

  request(requestOptions, function(err,response,body){

      renderHomePage(req, res, body);

  });

};

var renderHomePage = function(req, res, responseBody) {
  
  res.render('location-list', { title: 'Loc8r - find a place to work with wifi',
                                pageHeader : { 
                                  title : "Loc8r",
                                  strapline : 'Find place to work with wifi near you !'
                                },
                                sidebar : "Looking for wi-fi and a seat ? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a o pint ? Let Loc8r help you find the place you´re looking for.",
                                locations: responseBody

                              });
};

/* GET 'Location info' page using index extending layout*/

module.exports.locationInfo = function(req, res, next) {
  res.render('location-info', { title: 'Loc8r - find a place to work with wifi',
                                name : "StarFucks",
                                address:'122 Hight Street',
                                openingHours: ['Monday - Friday : 8:00 am - 7:00 pm',
                                               'Saturday        : 8:00 am - 5:00 pm',
                                               'Sunday          : Closed.'
                                              ], 
                                facilities: [ 'Hottterrr drinks', 'Food','Premium wifi'],
                                ratingAverage : 5,
                                resume: "Simon´s cafe is on loc8r bacause is has accessible wifi and space to sit down with your laptop and get some work done.....",
                                sendYourReview : "If you´ve been and you like it - or if you don´t - please leave a review to help other people just like you.",
                                locationMap: "http://maps.googleapis.com/maps/api/staticmap?center=51.455041,-0.9690884,&zoom=17&size=400x350&sensor=false&markers=51.455041,-0.9690884&scale=2",
                                reviews: [
                                   {
                                     author : "Emmanuelle Silva",
                                     date : "16 July 2013",
                                     rating : 5,
                                     text: "What a great place. I can´t say enought good things about it..."
                                   },
                                   {
                                     author : "Joaquim Ramos",
                                     date : "05 May 2016",
                                     rating : 2,
                                     text: "Não gostei... dei uma estrela só pra não ficar zerado. Café horrível e velocidade 'internet modem discado'...."
                                   }  

                                ]
                              });   
};

/* GET 'Add review' page using index extending layout*/

module.exports.addReview = function(req, res, next) {
  res.render('location-review-form', { title: 'Add review' });
};
