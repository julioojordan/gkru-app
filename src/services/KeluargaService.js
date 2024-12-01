import api from "./Api";

const getAllKeluarga = async () => {
  const url = "/keluarga";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getTotalKeluarga = async () => {
  const url = "/keluarga/getTotal";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const updateKeluarga = async (formData) => {
  const body = {
    IdWilayah: formData.Wilayah,
    IdLingkungan: formData.Lingkungan,
    Nomor: formData.Nomor,
    Alamat: formData.Alamat,
    Status: formData.Status,
    IdKepalaKeluarga: formData.KepalaKeluarga
  };
  const url = `/keluarga/${formData.IdKeluarga}/update`;
  try {
    const response = await api.patch(url, body);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const AddKeluarga = async (formData) => {
  const body = {
    IdWilayah: formData.IdWilayah, 
    IdLingkungan: formData.IdLingkungan,
    Nomor: formData.Nomor,
    Alamat: formData.Alamat
  };
  const url = "/keluarga/add";
  try {
    const response = await api.post(url, body);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getAllKeluarga,
  getTotalKeluarga,
  updateKeluarga,
  AddKeluarga
};
