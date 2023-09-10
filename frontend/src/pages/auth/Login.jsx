import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/userstyle.css'
import axios from 'axios'
import { useAlert } from 'react-alert';
import { useAuth } from '../../context/Auth'

const Login = () => {
    const location = useLocation()
    const [auth, setAuth] = useAuth()
    const alert = useAlert()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
                email,
                password,
            });
            if (res && res.data.success) {
                alert.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("auth", JSON.stringify(res.data))
                navigate(location.state || "/")
            } else {
                alert.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert.error("Something went wrong");
        }
    };

    return (
        <Layout title="Login - Ecommer App">
            <div className="form-container" style={{ minHeight: "90vh" }}>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">LOGIN FORM</h4>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Your Email "
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Enter Your Password"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <button
                            type="button"
                            className="btn forgot-btn"
                            onClick={() => {
                                navigate("/forgotpassword");
                            }}
                        >
                            Forgot Password
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        LOGIN
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default Login
