const express = require("express");
const mongoose = require("mongoose");
const Listing  =require("./models/listing.js");

const app = express();
const port = 3000;
const path = require("path");

const mongoUrl = "mongodb://127.0.0.1:27017/nestopia";

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));

main()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

app.get("/", (req, res) => {
  res.send("mirale miracle");
});

// app.get("/test",async (req,res)=>{

//   let sample= new Listing({
//     title:"new Villa",
//     description:"sabse expensive ghar",
//     price:2903121,
//     location:"jodhpur",
//     country:"india",
//   }) ;

//   await sample.save();
//   console.log("saved");
//   res.send("response saved");

// })


//index route
app.get("/listings",async(req,res)=>{
  const lists = await Listing.find({});
  res.render("listings/index.ejs",{lists});
})


//show route
app.get("/listings/:id",async(req,res)=>{
  let {id} =req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
})

//new route
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs");
})

//create route
app.post("/listings",async(req,res)=>{
 const newListing= new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings"); 
})

app.listen(port, () => {
  console.log("Server Started........");
});
