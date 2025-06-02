const express = require("express");
const mongoose = require("mongoose");
const Listing  =require("./models/listing.js");

const app = express();
const port = 3000;
const path = require("path");

const mongoUrl = "mongodb://127.0.0.1:27017/nestopia";

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"/views"));

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

app.listen(port, () => {
  console.log("Server Started........");
});
