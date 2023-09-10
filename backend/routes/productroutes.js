import express from 'express'
import { isAdmin, registertoken } from '../middleware/authmiddle.js';
import { brainpayment, braintoken, createproduct, deleteproduct, filterproduct, getallproducts, productCategoryController, productCountController, productListController, realtedProductController, searchProductController, singleproduct, updateproduct } from '../controllers/productctr.js';


const router = express.Router();


router.route("/createproduct").post(registertoken,isAdmin,createproduct)

router.route("/getallproducts").get(getallproducts)

router.route("/singleproduct/:id").get(singleproduct)

router.route("/updateproduct/:id").put(registertoken,isAdmin,updateproduct)

router.route("/deleteproduct/:id").delete(registertoken,isAdmin,deleteproduct)

router.route("/filterproduct").post(filterproduct)

router.route("/productcount").get(productCountController)

router.route("/productlist/:page").get(productListController)

router.route("/search/:keyword").get(searchProductController)

router.route("/relatedproduct/:pid/:cid").get(realtedProductController)

router.route("/productcategory/:slug").get(productCategoryController)

router.route("/braintree/token").get(braintoken)

router.route("/braintree/payment").post(registertoken,brainpayment)

export default router