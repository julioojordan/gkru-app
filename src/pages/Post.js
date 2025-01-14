import React from "react";
import { useLocation, useParams } from "react-router-dom";

const Post = () => {
  // untuk path variable
  const { pathVariable } = useParams();
  //untuk query params
  const queryParams = new URLSearchParams(useLocation().search);
  return (
    <div>
      <h2>Path Variable Value: {pathVariable}</h2>
      <h2>Params Value: {queryParams.get('name')}</h2>
    </div>
  );
};

export default Post;
