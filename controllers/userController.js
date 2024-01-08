//User function communicate with db
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
   success:true,
   user,
  })
  });

export const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("Please enter all field", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exist", 409));

  user = await User.create({
    name,
    email,
    password,
  });
  // send token
  sendToken(res, user, "Sign up Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("please enter all field", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 401));
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch)
    return next(new ErrorHandler("Invalid Email or Password", 401));
  sendToken(res, user, `Welcome Back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out Successfully",
    });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("please enter email", 400));
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("Invalid Email", 400));
  const resetToken = user.getResetToken();
  await user.save();
  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link to reset your password. ${url} . If you have not request then please ignore`;
  // send token via email
  await sendEmail(user.email,"LendClothes reset password", message);

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
   
  const {token} = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
     resetPasswordToken,
     resetPasswordExpire:{
      $gt : Date.now(),
     },

  });
   
  if(!user) return next(new ErrorHandler("Token is invalid or has been expired"));
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire=undefined;
  await user.save();

  res.status(200).json({
    success:true,
    message:"Password change Successfully",
  })

});

