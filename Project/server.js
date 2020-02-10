var express = require("express");
var app = express(); // create an app
var itemList = []; // store items on this array
var ItemDB;
var MessageDB;

/*********************************************************************************************    
*  CONFIGURATION   
**********************************************************************************************/

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
    next();
});


// config body-parse to read info in request
var bparser = require("body-parser");
app.use(bparser.json());

app.use(express.static( __dirname + '/public' ));

//to serve html
var ejs = require('ejs');
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
app.set('view engine',)

//MongoDB connection config
var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");
var db = mongoose.connection;
     
/*********************************************************************************************  
*  WEB SERVER ENDPOINTS
**********************************************************************************************/


app.get('/', (req, res) => {
    console.log("Someone wants the CATALOG page.");
    res.render('Catalog.html');
});

app.get('/contact', (req, res) =>{
    console.log("Someone wants the CONTACT page.")
    res.render('Contact.html');
});

app.get('/about', (req, res) => {
    console.log("Someone wants the ABOUT page.");
    res.send('About.html');
})

app.get('/admin', (req, res) => {
    console.log("Someone wants the ABOUT page.");
    res.send('Admin.html');
})

app.get('/exc/:message', (req, res) => {
    console.log("Message from client: ", req.params.message);

// send only the vowels back (GABE=AE)

    var msg = req.params.message;
    var vowels = '';
    var allVowels = ['a','e','i','o','u']

    // travel the msg string and print on console each letter
    for(var i=0; i<msg.length; i++){
        var letter = msg[i];
        console.log(letter);
        if(allVowels.indexOf(letter.toLowerCase()) != -1){

            if(vowels.includes(letter)){

            } else{
                vowels += letter;
            }

        };
        
    };
    res.status(202);
    res.send(vowels);
});






/*********************************************************************************************    
*  API END POINTS   
**********************************************************************************************/

// POST

app.post('/api/items', (req, res) => {
    console.log("client wants to store items");

    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(
        function(error, savedItem){
            if(error){
                console.log("***ERROR SAVING ITEM***", error);
                res.status(500);
                res.send(error);
            };
            console.log("Item Saved!");
            res.status(201);
            res.json(savedItem);
        }
    )
});

app.post('/api/messages', (req, res) => {
    var messageForMongo = MessageDB(req.body);
    messageForMongo.save(function(error, savedMessage) {
        if(error){
            console.log("***ERROR SAVING MESSAGE***");
            res.status(500);
            res.send(error);
        }
        console.log("Message Saved!");
        res.status(201);
        res.json(savedMessage);
    })
});

// GET

app.get('/api/items', (req, res) => {
    ItemDB.find({}, function(error, data){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200);
        res.json(data);
    })
});

app.get('/api/items/:id', (req, res) => {
    var id = req.params.id;
    ItemDB.find({_id: id}, function(error, item){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(item);
    })
});

app.get('api/items/byName/:name', (req, res) => {
    var name = req.params.name;
    ItemDB.find({ user: name }, function(error, data){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(data);
    })
});

app.get('/api/messages', (req, res) => {
    MessageDB.find({}, function(error, data){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(data);
    })
})


// DELETE

app.delete('/api/items', (req, res) => {
    var item = req.body;

    ItemDB.dinfByIdAndRemove(item._id, function(error){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200);
        res.send("Item removed!");
    })
});


     
/*********************************************************************************************  
*  START SERVER
**********************************************************************************************/
db.on('open', function(){
    console.log("Database Connection Successful");

    // define structure (models) for the object
    var itemsSchema = mongoose.Schema({
        code: String,
        description: String,
        price: Number,
        image: String,
        category: String,
        stock: Number,
        delivery: Number,
        user: String,
    });

    var messageSchema = mongoose.Schema({
        name: String,
        email: String,
        message: String,
    });

    ItemDB = mongoose.model("itemsCh6", itemsSchema);
    MessageDB = mongoose.model("messagesCh6", messageSchema);
});

db.on('error', function(){
    console.log("Error connecting to Database");
    console.log("error");
});

app.listen(8080, function(){
    console.log("Server running at http://localhost:8080");
    console.log("Press Ctrl+C to kill it");
});