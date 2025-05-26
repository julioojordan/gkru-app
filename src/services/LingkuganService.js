import api from "./Api";

const getAllLingkungan = async () => {
  const url = "/lingkungan";
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


const getAllLingkunganWithTotalKeluarga = async () => {
  const url = "/lingkunganWithTotalKeluarga";
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

const updateLingkungan = async (formData) => {
  const body = {
    namaLingkungan: formData.NamaLingkungan, 
    kodeLingkungan: formData.KodeLingkungan,
    wilayah: formData.Wilayah
  };
  const url = `/lingkungan/${formData.Id}/update`;
  try {
    const response = await api.patch(url, body);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getTotalLingkungan = async () => {
  const url = "/lingkungan/getTotal";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const addLingkungan = async (formData) => {
  const requestBody = {
    namaLingkungan: formData.NamaLingkungan,
    kodeLingkungan: formData.KodeLingkungan,
    wilayah: formData.Wilayah,
  }
  
  const url = "/lingkungan/add";
  try {
    const response = await api.post(url, requestBody);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};


const deleteLingkungan = async (id) => {
  const url = `/lingkungan/${id}/delete`;
  try {
    const response = await api.delete(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getAllLingkungan,
  updateLingkungan,
  getTotalLingkungan,
  addLingkungan,
  deleteLingkungan,
  getAllLingkunganWithTotalKeluarga
};
