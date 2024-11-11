import { useEffect } from "react";
import { Route, Routes, redirect, useLocation, useNavigate } from "react-router-dom";


const Profile2 = ({ login }) => {
  const navigate = useNavigate();
  //use effect dijalnakan saat pertama kali page dirender
  // penggunaan redirect v 2 pake use effect
  // dependency [login] cara pakainya gini:  misal value yang dimasukan ke dependency berubah, maka function di useEffect tadi akan dijalankan
  // tapi kalo pake useNavigate, meski tidak dikasih dependency kenapa useEFfect tetap dijalankan ya ?
  useEffect(() => {
    if (!login) {
      navigate("/");
    }
  });

  return (
    <div>
      Profile2 Page
    </div>
  );
};

export default Profile2;
