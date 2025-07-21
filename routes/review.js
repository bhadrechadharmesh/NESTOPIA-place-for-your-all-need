const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

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


//review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  const {id}=req.params;
  console.log(id);
  
  let listing= await Listing.findById(id);
  let newReview = await new Review(req.body.review);
  console.log(newReview,listing);
  
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}))

// delete review route

router.delete("/:reviewId" , async(req,res)=>{
  const {id,reviewId} = req.params ;
  // let listing =await Listing.findById(id);
  // console.log(listing.review);
  
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});

  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
})

module.exports = router ;
