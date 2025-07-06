import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  //get data
  const { name, email, password } = req.body;

  //validate
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // check if user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //create user if not exists
    const user = await User.create({ name, email, password });

    console.log(user);

    if (!user) {
      res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email",
      html: `<p>please click on following link to verify your email :</p> 
      <a href="${process.env.BASE_URL}/api/v1/user/verify/${token}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOption);
    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Issue",
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from url
  //validate token
  //find user based on token
  //if not
  // verified field to true/
  // remove verification ttoken
  //save
  //return response

  const { token } = req.params;
  console.log(token);

  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  user.isverified = true;
  user.verificationToken = undefined;
  await user.save();
};


export { registerUser, verifyUser };
