const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listings = require("./routes/listing.js");

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

const validateReview = (req,res,next)=>{
let {error} = reviewSchema.validate(req.body);
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


app.use("/listings",listings);

//review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
  const {id}=req.params;
  let listing= await Listing.findById(id);
  let newReview = await new Review(req.body.review);
  // console.log(newReview);
  
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}))

// delete review route

app.delete("/listings/:id/review/:reviewId" , async(req,res)=>{
  const {id,reviewId} = req.params ;
  // let listing =await Listing.findById(id);
  // console.log(listing.review);
  
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});

  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
})

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
