import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/Auth'
import { useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from "antd";
import { Prices } from '../components/Price';
import axios from 'axios';
import { useAlert } from 'react-alert'
import '../style/home.css'
import { useCart } from '../context/Cart';

const Home = () => {
  const alert = useAlert()
  // const [auth, setAuth] = useAuth()
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const getallcat = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/category/getallcategory")
      if (data?.success) {
        setCategories(data.category)
      }
    } catch (error) {
      alert.error("Something wrong with getting categorys")
    }
  }

  useEffect(() => {
    getallcat()
    totalcount()
  }, [])


  const getallproducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/v1/product/productlist/${page}`)
      if (data?.success) {
        setProducts(data.products)
      }
      setLoading(false);
    } catch (error) {
      alert.error("Something went wrong")
      setLoading(false);
    }
  }

  const totalcount = async()=>{
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/product/productcount");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);

  const loadmore = async()=>{
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/v1/product/productlist/${page}`)
      setProducts([...products, ...data?.products]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  }

  const filterproduct = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/v1/product/filterproduct", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!checked.length || !radio.length) getallproducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterproduct();
  }, [checked, radio]);

  return (
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      {/* <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      /> */}
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c.name}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={p.photo}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        alert.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore 
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
