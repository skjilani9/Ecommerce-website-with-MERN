import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import Adminmenu from '../../components/layout/Adminmenu'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAlert } from 'react-alert'

const Products = () => {
    const alert = useAlert()
    const [products, setProducts] = useState([])

    const getallproducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/product/getallproducts")
            if (data?.success) {
                setProducts(data.product)
            }
        } catch (error) {
            alert.error("Something went wrong")
        }
    }

    useEffect(() => {
        getallproducts()
    }, [])


    return (
        <Layout>
            <div className="container-fluid m-0 p-5 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <Adminmenu />
                    </div>
                    <div className="col-md-9 ">
                        <h1 className="text-center">All Products List</h1>
                        <div className="d-flex flex-wrap">
                            {products?.map((p) => (
                                <Link
                                    key={p._id}
                                    to={`/dashboard/admin/product/${p._id}`}
                                    className="product-link"
                                >
                                    <div className="card m-2" style={{ width: "18rem" }}>
                                        <img
                                            src={p.photo}
                                            className="card-img-top"
                                            alt={p.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products
