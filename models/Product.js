import { timeStamp } from "console";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    productname:{
        type:String,
        required:[true,"Product name is Required"],
        minLength:[3,"Name must be longer than 2 characters"]

    },
    productdescription:{
        type:String,
        required:[true,"Product description is required"],
        minLength:[10,"Product description must be atleast 10 character"],
    },
    actualprice:{
        type:Number,
        required:[true,"Actual price is required"],
    },
    finalprice:{
        type:Number,
        required:[true,"Final price is required"],
    },
    size:{
        type:String,
        required:[true,"Size is required"],
        minLength:[1,"Size must be atleast 1 characters"],
        maxLength:[6,"Size can't exceed 6 characters"],
    },
    productdetail:{
        type:String,
        required:[true,"Product description is required"],
        minLength:[10,"Product description must be atleast 10 character"], 
    },
    sizefit:{
        type:String,
    },
    materialcare:{
        type:String,
    },
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
    ],
     isAvailable:{
        type: Boolean,
        default: true,
      },
    category:{
        type:String,
        required:true,
    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    borrowby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }


  
},{ timestamps:true}
)
export const Product = mongoose.model("Product",schema);
