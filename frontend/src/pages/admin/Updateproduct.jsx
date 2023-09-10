import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout';
import Adminmenu from '../../components/layout/Adminmenu';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from 'react-alert';


const { Option } = Select

const Updateproduct = () => {
    const alert = useAlert()
    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id, setId] = useState("");

    const getsingleproduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/v1/product/singleproduct/${params.id}`)
            if (data?.success) {
                setName(data.product.name);
                setId(data.product._id);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setPrice(data.product.price);
                setQuantity(data.product.quantity);
                setShipping(data.product.shipping);
                setCategory(data.product.category);
                setPhoto(data.product.photo)
            }
        } catch (error) {
            alert.error("Error in fetching product")
        }
    }

    useEffect(() => {
        getsingleproduct()
    }, [])


    const postDetails = (pics) => {
        if (pics === undefined) {
            alert.error("Please select image")
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dycdl8sqx");
            fetch("https://api.cloudinary.com/v1_1/dycdl8sqx/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPhoto(data.url.toString());
                    console.log(data.url)
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            alert.error("somthing went wrong")
            return;
        }
    }

    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/category/getallcategory");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            alert.error("Something wwent wrong in getting catgeory");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);


    const handleUpdate = async(e) => {
        e.preventDefault();
        try {
            let form = {
                name,
                description,
                price,
                photo,
                category,
                quantity,
                shipping
            }
            const {data} = await axios.put(`http://localhost:8080/api/v1/product/updateproduct/${id}`,form)
            if(data?.success){
                alert.success("Product is Updated")
                navigate("/dashboard/admin/products")
            }
            else{
                alert.error(data.message)
            }
        } catch (error) {
            alert.error("something went wrong");
        }
    }

    const handleDelete = async() => {
        try {
            let answer = window.prompt("Are you confirm to delete product")
            if(!answer) return
            const {data} = await axios.delete(`http://localhost:8080/api/v1/product/deleteproduct/${id}`)
            if(data?.success){
                alert.success("Deleted successfully")
                navigate("/dashboard/admin/products")
            }
        } catch (error) {
            alert.error("something went wrong")
        }
    }

    return (
        <Layout title={"Dashboard - Create Product"}>
            <div className="container-fluid m-0 p-5">
                <div className="row">
                    <div className="col-md-3">
                        <Adminmenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select
                                bordered={false}
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => {
                                    setCategory(value);
                                }}
                                value={category}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className="btn btn-outline-secondary col-md-12">
                                    {photo ? "Change image" : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => postDetails(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img
                                            src={photo}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={photo}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="write a name"
                                    className="form-control"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="write a description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="write a Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="write a quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <Select
                                    bordered={false}
                                    placeholder="Select Shipping "
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    onChange={(value) => {
                                        setShipping(value)
                                    }}
                                    value={shipping ? "yes" : "No"}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    UPDATE PRODUCT
                                </button>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Updateproduct
