// ProtectedRoute.js
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [cookies] = useCookies(['auth_token']);

  if (!isLoggedIn || !cookies.auth_token) {
    return <Navigate to="/login" replace />
  }
  return element
}

export default ProtectedRoute
