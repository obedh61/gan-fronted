import React from 'react'
import { isAuth } from '../pages/helpers'
import { Navigate, Outlet } from 'react-router-dom'


function TablePrivate() {
    
  return (
    isAuth() ? <Outlet /> : <Navigate to='/signin' />
  )
}

export default TablePrivate