// useAuth.js
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { logout } from "../actions";
import Swal from "sweetalert2";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, , removeCookie] = useCookies(["auth_token"]);

  const handleLogout = async () => {
    await Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Your session has expired. Please log in again.",
      confirmButtonText: "OK",
    }).then(() => {
      removeCookie("auth_token");
      dispatch(logout());
      navigate("/login");
    });
  };

  return {
    handleLogout,
  };
};
