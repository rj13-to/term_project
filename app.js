var express =require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser =require("body-parser");
var assert = require("assert");
var multer= require("multer");
var path=require("path");
app.set('view engine','ejs');
const { strict } = require("assert");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/buddy",{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("data base connection succesfull!!! "))
.catch((err)=> console.log(err));
app.use(express.static("public"));
app.use(express.static("./pulic/uploads"));
var Storage =multer.diskStorage({
    destination:"./public/uploads",
    filename:(req,file,cb)=>{
        cb(null,file.filename+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload=multer({
    storage:Storage
}).single('img');
// all schema 



var profile=mongoose.Schema({
    FirstName: String,
    LastName: String,
    Address: String,
    UserName:String,
    ContactNumber: Number,
    password: String
});
var sign=mongoose.Schema({
    UserName:String,
    password:String
});
var sellcrop=mongoose.Schema({
    crop: String,
    weight: Number,
    person:String,
    ContactNumber:String,
    Address:String,
    img : String
});
var sellpro=mongoose.Schema({
    pro: String,
    price: Number,
    person:String,
    ContactNumber:String,
    Address:String,
    img : String
});


// schema ends 


// model starts


var users=mongoose.model('users',profile);
var valid=mongoose.model('valid',sign);
var spro=mongoose.model('spro',sellpro);
var scrop=mongoose.model('scrop',sellcrop);



// models ends


//get routes starts



app.get("/",function(req,res){
    res.render("entry.ejs");
})
app.get("/home",function(req,res){
    res.render("home.ejs");
})
app.get("/sc",function(req,res){
    res.render("sellcrops.ejs");
})
app.get("/sp",function(req,res){
    res.render("sellproduct.ejs");
})
app.get("/bc",function(req,res){
    scrop.find({},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("buycrops",{ans:ans});
        }
    })
})
app.get("/bp",function(req,res){
    spro.find({},function(err,ans){
        if(err) res.render("home.ejs");
        else{
            res.render("buyproduct.ejs",{ans:ans});
        }
    })
})
app.get("/si",function(req,res){
    res.render("signin.ejs");
})
app.get("/su",function(req,res){
    res.render("signup.ejs");
})
 
 

// get routes ends





// post routes starts


app.post("/su",function(req,res){
    var temp={
        UserName:String,
        password:String
    }
    temp.UserName=req.body.UserName;
    temp.password=req.body.password;
    users.create(req.body,function(err){
        if(err){
            res.render("signup.ejs");
        }else{
            valid.create(temp,function(err){
                if(err) res.render("signup.ejs");
                else res.render("entry.ejs");
            })
        } 
    })
})
app.post("/si",function(req,res){
    valid.find((req.body),function(err,ans){
        if(err){
            res.render("signin.ejs");
        }else if(ans.length==0){
            res.render("signin.ejs");
        }else {
            //person=req.body.UserName;
            res.render("home.ejs");
        }
    })
})
app.post("/sp",upload,function(req,res){
    var f={
        pro: String,
        price: Number,
        person:String,
        ContactNumber:String,
        Address:String,
        img : String
    };
    f.pro=req.body.pro;
    f.price=req.body.price;
    f.person=req.body.person;
    f.ContactNumber=req.body.ContactNumber;
    f.Address=req.body.Address;
    f.img=req.file.filename;
    spro.create(f,function(err){
        if(err) res.render("sellproduct.ejs");
        else res.render("home.ejs");
    })
} )

app.post("/sc",upload,function(req,res){
    var f={
        crop: String,
        weight: Number,
        person:String,
        ContactNumber:String,
        Address:String,
        img : String
    };
    f.crop=req.body.crop;
    f.weight=req.body.weight;
    f.person=req.body.person;
    f.ContactNumber=req.body.ContactNumber;
    f.Address=req.body.Address;
    f.img=req.file.filename;
    scrop.create(f,function(err){
        if(err){ 
            res.render("sellcrops.ejs");
        }
        else res.render("home.ejs");
    })
} )
// post routes ends
app.get("*",function(req,res){
    res.render("entry.ejs");
})
app.listen(3000,function(){
    console.log("server started!!!");
})