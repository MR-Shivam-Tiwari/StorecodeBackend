// controllers/registerController.js
const User = require('../Models/User');

const registerUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    console.log('User registered successfully:', savedUser);
    return savedUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

module.exports = registerUser;