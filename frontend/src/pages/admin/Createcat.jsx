import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import Adminmenu from '../../components/layout/Adminmenu'
import axios from 'axios'
import { useAlert } from 'react-alert';
import Categoryform from '../../components/forms/Categoryform';
import { Modal } from 'antd'

const Createcat = () => {
    const alert = useAlert()
    const [categorys, setCategorys] = useState([])
    const [name, setName] = useState()
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const getallcat = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/category/getallcategory")
            if (data?.success) {
                setCategorys(data.category)
            }
        } catch (error) {
            alert.error("Something wrong with getting categorys")
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`http://localhost:8080/api/v1/category/updatecategory/${selected._id}`, { name: updatedName })
            if (data?.success) {
                alert.success(`${updatedName} is updated`)
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getallcat();
            }else{
                alert.error(data.message)
            }
        } catch (error) {
        }
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:8080/api/v1/category/createcategory", { name })
            if (data?.success) {
                alert.success(`${name} is Created`)
                getallcat()
            }
        } catch (error) {
            alert.error("error in create category")
        }
    }

    const handleDelete = async(item)=>{
        try {
            const {data} = await axios.delete(`http://localhost:8080/api/v1/category/deletecategory/${item}`)
            if(data.success){
                alert.success("Category is deleted")
                getallcat()
            }
            else{
                alert.error(data.message)
            }
        } catch (error) {
            alert.error("Something went wrong")
        }
    }


    useEffect(() => {
        getallcat()
    }, [])

    return (
        <Layout>
            <div className="container-fluid m-0 p-5 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <Adminmenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Manage Category</h1>
                        <div className="p-3 w-100">
                            <Categoryform
                                handleSubmit={handlesubmit}
                                value={name}
                                setValue={setName}
                            />
                        </div>
                        <div className="w-100">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="w-30">Name</th>
                                        <th scope="col" className="w-70">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorys?.map((c) => (
                                        <>
                                            <tr>
                                                <td key={c._id}>{c.name}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary ms-2"
                                                        onClick={() => {
                                                            setVisible(true);
                                                            setUpdatedName(c.name);
                                                            setSelected(c);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger ms-2"
                                                    onClick={() => {
                                                        handleDelete(c._id);
                                                    }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            visible={visible}
                        >
                            <Categoryform
                                value={updatedName}
                                setValue={setUpdatedName}
                                handleSubmit={handleUpdate}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Createcat
