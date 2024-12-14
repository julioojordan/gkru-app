import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook untuk menangani tombol back browser
 * @param {string} path - Path tujuan saat tombol back ditekan.
 */
const useHandleBack = (path) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate(path);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, path]);
};

export default useHandleBack;
