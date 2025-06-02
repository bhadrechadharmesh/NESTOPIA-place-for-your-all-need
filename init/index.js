const mongoose =require("mongoose");
const Listing =require("../models/listing.js");
const initData = require("./sampleDb.js");

const mongoUrl = "mongodb://127.0.0.1:27017/nestopia";

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

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("data was added");
    
}

initDB();