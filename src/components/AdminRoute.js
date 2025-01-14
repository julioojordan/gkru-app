import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

const AdminRoute = ({ element }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const roleRedux = useSelector((state) => state.role.role);
  const [cookies] = useCookies(['auth_token']);

  if (!isLoggedIn || !cookies.auth_token) {
    return <Navigate to="/login" replace />
  }

  if (roleRedux !== 'admin') {
    return <Navigate to="/aturan" replace />
  }

  return element;
}

export default AdminRoute;
