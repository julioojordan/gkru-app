import { Route, Routes, Navigate, HashRouter, BrowserRouter } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";

import ProtectedRouteLogin from './pages/ProtectedRouteLogin'

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

function App() {
  const { setColorMode } = useColorModes();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  useEffect(() => {
    setColorMode('light'); // Paksa base root pakai ligt mode dulu
  }, []);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" element={<ProtectedRouteLogin element={<Login/>} />} />
          {!isLoggedIn && <Route path="*" element={<Login />} />}
          {isLoggedIn && <Route path="*" element={<DefaultLayout />} />}

          <Route path="*" element={<DefaultLayout />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
