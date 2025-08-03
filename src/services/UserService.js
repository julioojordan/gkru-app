import api from "./Api";

const getAllUser = async () => {
  const url = "/user";
  try {
    const response = await api.get(url);
    if(response.data.data){
      return Promise.resolve(response.data.data);
    }else{
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const updateUser = async (formData) => {
  const body = {
    username: formData.Username, 
    ketuaLingkungan: formData.KetuaLingkungan,
    ketuaWilayah: formData.KetuaWilayah,
    updatedBy: formData.UpdatedBy,
    password: formData.Password
  };
  const url = `/user/${formData.Id}/update`;
  try {
    const response = await api.patch(url, body);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const addUser = async (formData) => {
  const url = "/user/add";
  try {
    const response = await api.post(url, formData);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const deleteUser = async (id) => {
  const url = `/user/${id}/delete`;
  try {
    const response = await api.delete(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getAllUser,
  updateUser,
  addUser,
  deleteUser
};
