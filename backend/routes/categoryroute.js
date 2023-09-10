import express from 'express'
import { isAdmin, registertoken } from '../middleware/authmiddle.js';
import { createcategory, deletecategory, getallcategory, singlecategory, updatecategory } from '../controllers/categoryctr.js';

const router = express.Router();

router.route("/createcategory").post(registertoken,isAdmin,createcategory)
router.route("/updatecategory/:id").put(registertoken,isAdmin,updatecategory)
router.route("/getallcategory").get(getallcategory)
router.route("/getsinglecategory/:slug").get(singlecategory)
router.route("/deletecategory/:id").delete(registertoken,isAdmin,deletecategory)


export default router