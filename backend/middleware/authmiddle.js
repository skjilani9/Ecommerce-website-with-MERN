import jwt from 'jsonwebtoken'
import usermodel from '../models/usermodel.js'


export const registertoken = async (req, res,next) => {
    try {
        const decode = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
}


export const isAdmin = async (req, res, next) => {
    try {
        const user = await usermodel.findById(req.user._id);
        if (user.role !== "admin") {
            return res.send({
                success: false,
                message: "UnAuthorized Access",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middelware",
        });
    }
};