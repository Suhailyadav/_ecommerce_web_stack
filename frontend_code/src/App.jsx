import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Error from './pages/Error'
import {Logout} from './pages/Logout'
import Create from './pages/Create'
import ProductList from './pages/ProductList'
import Private from './Routes/Private'
import Cart from './pages/Cart'
import Order from './pages/Order'


const App = () => {
  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
       
        <Route path='/create' element={<Create />} />  {/* Note the empty path here */}
        <Route path="/order-summary" element={<Order />} />
        <Route path='/products' element={<Private />}>
        <Route path='/products' element={<ProductList />} /> 
        </Route>
        {/* <Route path='/cart' element={<Private />}> */}
        <Route path='/cart' element={<Cart />} /> 
        {/* </Route> */}
        
        <Route path='*' element={<Error/>} />

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

