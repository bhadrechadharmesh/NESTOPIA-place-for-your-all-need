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

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("review");
  res.render("listings/show.ejs", { listing });
}));

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create route
router.post("/",validateListing,wrapAsync( async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",  wrapAsync(async(req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
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
  res.redirect("/listings");
}))

module.exports=router;