const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 3000;
const path = require("path");
const sessionOptions = {
  secret:"top secret",
  resave:false ,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 1000*60*60*24*3,
    maxAge: 1000*60*60*24*3,
    httpOnly:true
  }
}

const mongoUrl = "mongodb://127.0.0.1:27017/nestopia";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(session(sessionOptions));
app.use(flash());

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

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})


app.use("/listings",listings);
app.use('/listings/:id/reviews',reviews);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error/error.ejs",{message});
  // res.render("error/error.ejs",{message});
});

app.listen(port, () => {
  console.log("Server Started........");
});
