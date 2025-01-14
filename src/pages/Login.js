import React from "react";
import { useForm } from "react-hook-form";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { CButton, CRow, CCol } from "@coreui/react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { login, setRole } from "../actions";
import services from "../services";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setCookie] = useCookies(["auth_token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getRole = (data) => {
    if (data.ketuaLingkungan === 0 && data.ketuaWilayah === 0) {
      return "admin";
    }
    if (data.ketuaLingkungan !== 0 && data.ketuaWilayah !== 0) {
      return "ketuaLingkungan";
    }
    if (data.ketuaLingkungan === 0 && data.ketuaWilayah !== 0) {
      return "ketuaWilayah";
    }
  };

  const auth = async (formValue) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const expiryDate = new Date(Date.now() + oneDay);

    try {
      const { data } = await services.LoginService(
        formValue.username,
        formValue.password
      );
      setCookie("auth_token", data.auth, { path: "/", expires: expiryDate });
      dispatch(
        login({
          authToken: data.auth,
          id: data.id,
          username: data.username,
          ketuaLingkungan: data.ketuaLingkungan,
          ketuaWilayah: data.ketuaWilayah,
        })
      );
      const roleLogin = getRole(data)
      dispatch(setRole(roleLogin));
      if (roleLogin !== "admin") {
        navigate("/aturan");
      }else{
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (
        error.response &&
        error.response.data.message === "user tidak ditemukan"
      ) {
        await Swal.fire({
          title: "Login Gagal",
          text: "User tidak ditemukan. Silakan periksa kembali username dan password Anda.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          title: "Login Gagal",
          text: "Terjadi kesalahan saat login. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">
                Please enter your username and password!
              </p>
              <Form onSubmit={handleSubmit(auth)}>
                {errors.username && (
                  <span style={{ color: "red" }}>Username diperlukan</span>
                )}
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  label="Username"
                  id="username"
                  size="lg"
                  {...register("username", { required: true })}
                />
                {errors.password && (
                  <span style={{ color: "red" }}>Password Diperlukan</span>
                )}
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  label="Password"
                  id="password"
                  type="password"
                  size="lg"
                  {...register("password", { required: true })}
                />
                <MDBCheckbox
                  name="flexCheck"
                  id="flexCheckDefault"
                  className="mb-4"
                  label="Remember password"
                />
                <CRow className="gy-3 justify-content-center">
                  <CCol xs="12" md="12" xl="12">
                    <CButton type="submit" color="primary" className="w-100">
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </Form>
              <hr className="my-4" />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
