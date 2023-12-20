const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  name: String,
  about: String,
  instagramLink: String,
  youtubeLink: String,
  profileImage: String, 
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;