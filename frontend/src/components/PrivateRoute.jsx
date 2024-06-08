import { useState } from "react"
import { Outlet, Navigate } from "react-router-dom"

const PrivateRoute = () => {
    const { currentUser } = useState(false)
  return currentUser ? <Outlet /> : <Navigate to='sign-in' />
}

export default PrivateRoute