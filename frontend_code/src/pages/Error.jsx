import React from 'react'
import { NavLink } from 'react-router-dom'
import './Error.css'

const Error = () => {
  return (
    <section className='error-section'>
      <div className="section">
  <h1 className="error">404</h1>
  <div className="page">Ooops!!! The page you are looking for is not found</div>
  <NavLink className="back-home" to="/home">Back to home</NavLink>
</div>

    </section>
  )
}

export default Error
