const Express = require("express");
const router = Express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("review");
  if(!listing) {
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
}));

//create route
router.post("/",validateListing,wrapAsync( async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New listing created")
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",  wrapAsync(async(req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id", wrapAsync (async(req, res) => {
  const{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async(req,res)=>{
  const {id} = req.params ;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted")
  res.redirect("/listings");
}))

module.exports=router;