const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const app = express();
const port = 3000;
const path = require("path");

const mongoUrl = "mongodb://127.0.0.1:27017/nestopia";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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

const validateListing = (req,res,next)=>{
let {error} = listingSchema.validate(req.body);
  // console.log(result);
  if(error) {
    let msg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,msg)
  } else {
    next();
  }
};

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
app.get("/listings", async (req, res) => {
  const lists = await Listing.find({});
  res.render("listings/index.ejs", { lists });
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//new route
app.get("/listing/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create route
app.post("/listings",validateListing,wrapAsync( async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",  wrapAsync(async(req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", wrapAsync (async(req, res) => {
  const{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
  const {id} = req.params ;
  await Listing.deleteOne({_id:id});
  res.redirect("/listings");
}))

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err,req,res,next)=>{
  let{status=500,message="something went wrong"}=err;
  // res.status(status).send(message);
  res.render("error/error.ejs",{message});
});

app.listen(port, () => {
  console.log("Server Started........");
});
