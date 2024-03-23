import React from "react";
import { useForm } from "react-hook-form";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Form } from "react-bootstrap";
import { useNavigate  } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = (data) => {
    console.log(data); // Lakukan sesuatu dengan data yang dikirimkan
    navigate("/about");
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
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Username"
                id="username"
                size="lg"
                {...register("username", { required: true })}
              />
              {errors.username && <span>This field is required</span>}
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Password"
                id="password"
                type="password"
                size="lg"
                {...register("password", { required: true })}
              />
              {errors.password && <span>This field is required</span>}
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                className="mb-4"
                label="Remember password"
              />
              <MDBBtn size="lg" type="submit" className="w-100">
                Login
              </MDBBtn>
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
