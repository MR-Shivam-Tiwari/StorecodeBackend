const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "wasdevelopedagainstdraftietfoaut";

// Middleware for handling validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

router.post(
  "/newuser",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("name").isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
    body("contact").notEmpty().withMessage("Contact is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let securepass = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        password: securepass,
        email: req.body.email,
        contact: req.body.contact,
      });

      // Return the created user (with sensitive info stripped)
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "An error occurred" });
    }
  }
);


// LOGIN USER

router.post(
  "/loginuser",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 5 }).withMessage("Incorrect password"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await User.findOne({ email });

      if (!userData) {
        return res.status(400).json({ success: false, errors: "Try Login With Correct Credentials" });
      }

      const passwordcompare = await bcrypt.compare(password, userData.password);

      if (!passwordcompare) {
        return res.status(400).json({ success: false, errors: "Try Login With Correct Credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);

      res.json({
        success: true,
        message: "Login successful",
        user: userData,
        authToken: authToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "An error occurred" });
    }
  }
);

module.exports = router;
