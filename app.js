const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())) ;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/demo",async(req,res)=>{
  let fakeUser = new User({
    email:"demo@gmail.com",
    username : 'student-1'
  })

  let registeredUser =  await User.register(fakeUser,"helloWorld");
  res.send(registeredUser);
})


app.use("/listings",listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use("/",userRouter);

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
