import { catchAsyncError } from "../middlewares/catchAsyncError";

export const createReview =  catchAsyncError(async (req,res,next)=>{
    console.log("Create Review");
})