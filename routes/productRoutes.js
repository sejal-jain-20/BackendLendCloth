import express from "express";
import { borrowedProduct, createproduct, deleteproduct,   getUserProduct,   getallproduct,  returnBorrowedProduct,  selectproduct,  updateproduct } from "../controllers/productController.js";
import { isAuthenticate } from "../middlewares/Auth.js";
import multipleUpload from "../middlewares/multer.js";

const router = express.Router();

//Create product ..post req 
router.route("/createproduct").post( isAuthenticate,multipleUpload, createproduct)

//delete product ..delete req
router.route("/product/:id").delete(isAuthenticate , deleteproduct)

//get product  ..get req
router.route("/product").get(getallproduct)


//update product  ..put req
router.route("/product/:id").put(isAuthenticate , updateproduct)

//borrow product ..get
router.route('/borrow/:id').put(isAuthenticate, borrowedProduct);
// delete borrow product ...put
router.route('/borrow/:id').delete(isAuthenticate, returnBorrowedProduct);

router.route('/userproducts').get(isAuthenticate,getUserProduct)

router.route('/product/:id').get(isAuthenticate,selectproduct)






export default router ;