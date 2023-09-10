import Productmodel from '../models/productmodels.js'
import slugify from "slugify";
import categoryModel from '../models/categorymodel.js'
import braintree from 'braintree'
import orderModel from '../models/ordermodel.js'

import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAIN_ID,
  publicKey: process.env.BRAINPUBLIC_KEY,
  privateKey: process.env.BRAINPRIVATE_KEY,
});


export const createproduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, photo } = req.body
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
    const products = new Productmodel({ ...req.body, slug: slugify(name) });
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
}




export const getallproducts = async (req, res) => {
  try {
    const product = await Productmodel.find({}).populate("category").sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      counTotal: product.length,
      message: "ALL Products ",
      product,
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
}


export const singleproduct = async (req, res) => {
  try {
    const product = await Productmodel.findById(req.params.id).populate("category")
    if (product) {
      res.status(200).send({
        success: true,
        message: "Product find successfully",
        product
      })
    }
    else {
      res.status(404).send({
        success: false,
        message: "Product not found"
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
}



export const updateproduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, photo } = req.body
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
    const product = await Productmodel.findByIdAndUpdate(req.params.id, { ...req.body, slug: slugify(name) });
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Update Successfully",
      product,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
}




export const deleteproduct = async (req, res) => {
  try {
    const product = await Productmodel.findByIdAndDelete(req.params.id)
    if (product) {
      res.status(200).send({
        success: true,
        message: "Deleted successfully"
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Deleteing product",
    });
  }
}





export const filterproduct = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Productmodel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
}



export const productCountController = async (req, res) => {
  try {
    const total = await Productmodel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await Productmodel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await Productmodel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
    res.json(resutls);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Productmodel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await Productmodel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};


export const braintoken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}



export const brainpayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
