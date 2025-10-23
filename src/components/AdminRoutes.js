import React from 'react'
import { isAuth } from '../pages/helpers'
import { Navigate, Outlet } from 'react-router-dom'


function AdminRoutes() {
    
  return (
    isAuth() && isAuth().role == 'admin' ? <Outlet /> : <Navigate to='/signin' />
  )
}

export default AdminRoutes