const Express = require("express");
const router = Express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner} = require("../middleware.js");



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

//index route
router.get("/", async (req, res) => {
  const lists = await Listing.find({});
  res.render("listings/index.ejs", { lists });
});

//new route
router.get("/new",isLoggedin,(req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
  if(!listing) {
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings");
  } else {
    // console.log(listing);
    // console.log(res.locals.currUser);
    // console.log(listing.review);
    res.render("listings/show.ejs", { listing });
  }
}));

//create route
router.post("/",validateListing,isLoggedin,wrapAsync( async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New listing created")
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isOwner,isLoggedin,validateListing, wrapAsync(async(req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id", isLoggedin,isOwner,validateListing,wrapAsync (async(req, res) => {
  const{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedin,isOwner ,wrapAsync(async(req,res)=>{
  const {id} = req.params ;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted")
  res.redirect("/listings");
}))

module.exports=router;