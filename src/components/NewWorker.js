import React from 'react'
import { isAuth } from '../pages/helpers'
import { Navigate, Outlet } from 'react-router-dom'


function NewWorker() {
    
  return (
    isAuth() ? <Outlet /> : <Navigate to='/home' />
  )
}

export default NewWorker