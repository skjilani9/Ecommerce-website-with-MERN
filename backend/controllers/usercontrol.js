import { comparepass, hashpassword } from '../auth/authhelp.js'
import usermodel from '../models/usermodel.js'
import jwt from 'jsonwebtoken'
import orderModel from '../models/ordermodel.js'



export const registeruser = async (req, res) => {
    try {
        const { name, email, phone, password, answer, address } = req.body
        if (!name) {
            return res.send({ error: "Name is Required" })
        }
        if (!email) {
            return res.send({ error: "Email is Required" })
        }
        if (!phone) {
            return res.send({ error: "Password is Required" })
        }
        if (!password) {
            return res.send({ error: "Phone num is Required" })
        }
        if (!address) {
            return res.send({ error: "Address is Required" })
        }
        if (!answer) {
            return res.send({ error: "Answer is Required" })
        }

        const userexits = await usermodel.findOne({ email })
        if (userexits) {
            return res.status(500).send({
                success: true,
                message: "Already Register !Please Login"
            })
        }
        const hashedpassword = await hashpassword(password)

        const user = await new usermodel({ name, email, phone, address, answer, password: hashedpassword }).save()
        res.status(201).send({
            success: true,
            message: "Register successfully",
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Register"
        })
    }
}




export const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please Enter Valid Email or Password"
            })
        }

        const user = await usermodel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not register"
            })
        }

        const match = await comparepass(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            })
        }

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
    }
}





export const forgotpassword = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await usermodel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashpassword(newPassword);
        await usermodel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};



export const profileupdate = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await usermodel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashpassword(password) : undefined;
        const updatedUser = await usermodel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
                email: email || user.email
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
}



export const userorder = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}


export const allorders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}


export const updateorder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }


}