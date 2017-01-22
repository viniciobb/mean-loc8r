var mongoose =require("mongoose");

var openingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
    author: String,
    rating: {type: Number , 'default': 0 , min: 0 , max: 5},
    reviewText: String,
    createOn: {type: Date, "default": Date.now}
    
});

var coordenateSchema = new mongoose.Schema({
    name : { type : String, require: true }, 
    // name : { type: String, "default" : 0 } para estabelecer valores default  
    coords : {type : [Number], index: '2dsphere'}
    // index 2dsphere -> mongo faz cálculos geométricos baseados em um objeto esférico->  geoJSON -> longitude/latitude 
});

var locationSchema = new mongoose.Schema({
    name : { type : String, require: true }, 
    // name : { type: String, "default" : 0 } para estabelecer valores default  
    address: String, 
    rating: {type: Number , default: 0 , min: 0 , max: 5},
    facilities: [String],
    coords : {type : [Number], index: '2dsphere', require: true},
    openingTimes : [openingTimeSchema],
    reviews : [reviewSchema]

    // index 2dsphere -> mongo faz cálculos geométricos baseados em um objeto esférico->  geoJSON -> longitude/latitude 
});

mongoose.model('Location', locationSchema);
mongoose.model('Coordenate', coordenateSchema);