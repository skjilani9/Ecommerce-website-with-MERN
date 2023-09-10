import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Pagenotfound from './pages/Pagenotfound';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import PrivateRoute from './components/route/Private';
import Dashboard from './pages/user/Dashboard';
import Forgotpassword from './pages/auth/Forgotpassword';
import Adminroute from './components/route/Adminroute';
import Admindashboard from './pages/admin/Admindashboard';
import Createcat from './pages/admin/Createcat';
import Createpro from './pages/admin/Createpro';
import Users from './pages/admin/Users';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';
import Products from './pages/admin/Products';
import Updateproduct from './pages/admin/Updateproduct';
import Searchproducts from './pages/Searchproducts';
import Productdetails from './pages/Productdetails';
import Category from './pages/Category';
import Categoryproduct from './pages/Categoryproduct';
import Cartpage from './pages/Cartpage';
import Adminorders from './pages/admin/Adminorders';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Pagenotfound />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/categories' element={<Category />} />
        <Route path='/category/:slug' element={<Categoryproduct />} />
        <Route path='/search' element={<Searchproducts/>}/>
        <Route path='/product/:id' element={<Productdetails />} />
        <Route path='/forgotpassword' element={<Forgotpassword />} />
        <Route path='/cart' element={<Cartpage />}/>

        <Route path='/dashboard' element={<PrivateRoute />}>
          <Route path='user' element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>

        <Route path='/dashboard' element={<Adminroute />}>
          <Route path='admin' element={<Admindashboard />} />
          <Route path="admin/create-category" element={<Createcat/>} />
          <Route path="admin/create-product" element={<Createpro />} />
          <Route path='admin/products' element={<Products />} />
          <Route path='admin/product/:id' element={<Updateproduct />}/>
          <Route path="admin/users" element={<Users />} />
          <Route path='admin/orders' element={<Adminorders />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
