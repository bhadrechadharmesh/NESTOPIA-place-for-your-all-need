const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error" , "You must be login first");
        return res.redirect("/login");
    }
    next();
} 

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        // console.log(req.session.redirectUrl);
        
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const{id}=req.params;
  let listing = Listing.findById(id);
  if(listing.owner._id!=res.locals.currUser._id) {
    req.flash("error","You are not Authorized");
    return res.redirect(`/listings/${id}`);
  }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    let review =await Review.findById(reviewId); 
    if(!review.author._id.equals( res.locals.currUser._id)) {
        req.flash("error","you are not authorized");
        return res.redirect(`/listings/${id}`);
    }

    next();
};