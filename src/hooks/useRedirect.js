import { useNavigate } from "react-router-dom";

export const useRedirect = () => {
    
  const navigate = useNavigate();
  const redirectToBefore = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  }

  return {
    redirectToBefore
  };
};

