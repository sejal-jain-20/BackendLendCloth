import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary  from 'cloudinary'
 

export const getallproduct = catchAsyncError(async (req,res,next) =>{
  const product = await Product.find().populate({
    path: 'createdby borrowby',
    select: 'name', // Specify the fields you want to populate for both createdby and borrowby
  })
  res.status(200).json({
   success:true,
   product,
  });
});

export const getUserProduct = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const filter = {
    $or: [{ createdby: userId }, { borrowby: userId }],
  };

  try {
    const products = await Product.find(filter).populate({
      path: 'createdby borrowby',
      select: 'name',
    })
    if (!products || products.length === 0) {
      return next(new ErrorHandler("No products found for the user", 401));
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      message: "Product list",
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching products", 500));
  }
});

export const createproduct = catchAsyncError(async (req, res, next) => {
  const {
    productname,
    productdescription,
    actualprice,
    finalprice,
    size,
    productdetail,
    sizefit,
    materialcare,
    category,
  } = req.body;

  // console.log('Fields:', { productname, productdescription, actualprice, finalprice, size, productdetail, sizefit, materialcare, category });

  if (!productname || !productdescription || !actualprice || !finalprice || !size || !productdetail || !sizefit || !materialcare || !category)
    return next(new ErrorHandler("Please enter all field", 400));

    const files = req.files;

    const imageUrls = [];
    
    for (const file of files) {
      const fileUri = getDataUri(file);
      
      try {
        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
        imageUrls.push({
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        });
      } catch (error) {
        return next(new ErrorHandler("Error uploading images", 500));
      }
    }
  
  const newProduct = await Product.create({
    productname,
    productdescription,
    actualprice,
    finalprice,
    size,
    productdetail,
    sizefit,
    materialcare,
    category,
    createdby: req.user._id,
    borrowby: null,
    images: imageUrls, // Use the array of image URLs
  });

  const user = await User.findById(req.user._id);
  user.lendtoken += 1;
  await user.save();

  res.status(201).json({
    success: true,
    message: "Product created Successfully",
  });
});


export const updateproduct = catchAsyncError(async (req,res,next)=>{
  const allowedFields = ['productname' ,'productdescription','actualprice','finalprice' ,'productdetail' ];

  const updateData ={};
  Object.keys(req.body).forEach((keyName)=> {
    if(allowedFields.includes(keyName)) {
      updateData[keyName]=req.body[keyName];
      }
      });
  
  
  let prod=await Product.findByIdAndUpdate(req.params.id,updateData ,{new:true})
  if(!prod)
  return next( new ErrorHandler(`No product with the id of ${req.params.id}`,404))
else{

  return res.status(200).json({
    success:true,
    data:prod,
    message :"Update fields successfully"
  
   });
}

});

export const selectproduct = catchAsyncError(async (req,res,next)=>{
  const prod=await Product.findById(req.params.id);
  if(!prod)
  return next( new ErrorHandler(`No product with the id of ${req.params.id}`,404))
else{

  return res.status(200).json({
    success:true,
    data:prod,
    message :"selected product successfully"
  
   });
}
})

export const deleteproduct = catchAsyncError(async (req,res,next)=>{
  
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  for (let i = 0; i < product.images.length; i++) 
  {
    let image = product.images[i];
    await cloudinary.v2.uploader.destroy(image.public_id);
    console.log(product.images.public_id)
  }
   product = await Product.deleteOne({_id:productId });
  if (!product) return next(new ErrorHandler('This product does not exist',400));
  
  res.status(200).json({
    success: true,
    message: "Product Delete Successfully.",
  });
})

export const borrowedProduct = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const product = await Product.findById(req.params.id);
  // console.log("hio")

  if (!product || !product.isAvailable) return next(new ErrorHandler("Product not found or unavailable"));
  if (product.createdby.equals(userId)) 
    return next(new ErrorHandler("You are the lender of this product"));
 
  
  product.borrowby = userId;
  product.isAvailable = false;

  
  await product.save();
  const user = await User.findById(userId);
  user.lendtoken -= 1;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Borrow the product successfully",
    token:user.lendtoken
  });
});


export const returnBorrowedProduct = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id
  const product =  await Product.findById( req.params.id);
  if(!product) return next(new ErrorHandler("Product not available",404))
  if(!product.borrowby.equals(userId)) return next(new ErrorHandler("Unauthorize",401))
      product.borrowby=null;
      product.isAvailable = true;
      await product.save();

    res.status(200).json({
      success: true,
      message: "Return successfully",
    });
  
});




