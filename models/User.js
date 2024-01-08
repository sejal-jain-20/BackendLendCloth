import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unqiue: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be atleast 6 characters"],
    select: false,
  },
  lendtoken:{
    type:Number,
    default:5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: String,
});

schema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
});

schema.methods.getJWTToken=function(){
  return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
    expiresIn:'15d',
  })
}

schema.methods.comparePassword=  async function(password){
  console.log(this.password)
  return await bcrypt.compare(password,this.password);
}

schema.methods.getResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15*60*1000;
  return resetToken;
}

export const User = mongoose.model("User", schema);
