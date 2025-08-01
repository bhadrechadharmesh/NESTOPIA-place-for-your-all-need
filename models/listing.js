const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    
      filename:{
        type:String,
      }, url:{
        type:String,
        set:(v)=> v==="" ? "https://images.unsplash.com/photo-1749225595496-06cd2c49fa2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v ,
      }
    
  },
  price: Number,
  location: String,
  country: String,
  review:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"user",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  // console.log(listing);
  if(listing) {
    await Review.deleteMany({id:{$in : listing.review}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing ;
