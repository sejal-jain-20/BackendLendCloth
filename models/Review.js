import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    rating:{
        type:Number,
        required:[true,"Please provide a rating."],
        min:[1,"Rating must be at least 1."],
        max:[5,"Rating cannot exceed 5."]
    },
    comment:{
        type:String,
        required:[true,"Please provide a comment."]
    },

})
