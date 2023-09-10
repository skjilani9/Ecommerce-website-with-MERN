import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import Usermenu from '../../components/layout/Usermenu'
import { useAuth } from '../../context/Auth';
import { useAlert } from 'react-alert';
import axios from 'axios';

const Profile = () => {
    const [auth, setAuth] = useAuth();
    const alert = useAlert
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
  
    //get user data
    useEffect(() => {
      const { email, name, phone, address } = auth?.user;
      setName(name);
      setPhone(phone);
      setEmail(email);
      setAddress(address);
    }, [auth?.user]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put("http://localhost:8080/api/v1/auth/updateprofile", {
                name,
                email,
                password,
                phone,
                address,
            });
            if (data?.errro) {
                alert.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                alert.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            alert.error("Something went wrong");
        }
    };
    return (
        <Layout title={"Your Profile"}>
            <div className="container-fluid m-0 p-3 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <Usermenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container" style={{ marginTop: "-40px" }}>
                            <form onSubmit={handleSubmit}>
                                <h4 className="title">USER PROFILE</h4>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Name"
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Email "
                                        disabled
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
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Phone"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Enter Your Address"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    UPDATE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
