import express from 'express'
import { allorders, forgotpassword, loginuser, profileupdate, registeruser, updateorder, userorder } from '../controllers/usercontrol.js';
import { isAdmin, registertoken } from '../middleware/authmiddle.js';
const router = express.Router();




router.route("/register").post(registeruser)


router.route("/login").post(loginuser)


router.route("/user-auth").get(registertoken,(req,res)=>{
    res.status(200).send({ ok: true });
})

router.route("/admin-auth").get(registertoken,isAdmin,(req,res)=>{
    res.status(200).send({ ok: true });
})


router.route("/forgotpassword").post(forgotpassword)


router.route("/updateprofile").put(registertoken,profileupdate)

router.route("/orders").get(registertoken,userorder)

router.route("/allorders").get(registertoken,isAdmin,allorders)

router.route("/updateorder/:orderId").put(registertoken,isAdmin,updateorder)


export default router