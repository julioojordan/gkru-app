import api from "./Api";

const getTotalAnggota = async () => {
  const url = "/anggota/getTotal";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllAnggotaWithIdKeluarga = async (idKeluarga) => {
  const url = `/anggota?idKeluarga=${idKeluarga}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const AddAnggota = async (formData) => {
  const url = `/anggota/add`;
  try {
    const response = await api.post(url, formData); // Menggunakan api.post yang sudah ada interceptornya
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};
const UpdateAnggota = async (formData) => {
  const url = `/anggota/${formData.Id}/update`;
  try {
    const response = await api.patch(url, formData);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const deleteAnggota = async (id) => {
  const url = `/anggota/${id}/delete`;
  console.log({url})
  try {
    const response = await api.delete(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getTotalAnggota,
  getAllAnggotaWithIdKeluarga,
  AddAnggota,
  UpdateAnggota,
  deleteAnggota
};
