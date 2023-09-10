import React from 'react'
import Layout from '../../components/layout/Layout'
import Adminmenu from '../../components/layout/Adminmenu'

const Users = () => {
    return (
        <Layout>
            <div className="container-fluid m-0 p-5 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <Adminmenu />
                    </div>
                    <div className="col-md-9">
                        <h1>User</h1>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Users
