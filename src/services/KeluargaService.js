import api from "./Api";

const getKeluargaById = async (id) => {
  let url = `/keluarga/${id}`;
  try {
    const response = await api.get(url);
    console.log("response", response.data.data)
  if(response.data.data){
    return Promise.resolve(response.data.data);
  }else{
    return Promise.resolve([]);
  }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
}

const getAllKeluarga = async (idLingkungan, idWilayah) => {
  let url = "/keluarga";

  const queryParams = [];
  if (idLingkungan && idLingkungan !== 0) queryParams.push(`idLingkungan=${idLingkungan}`);
  if (idLingkungan && idWilayah !== 0) queryParams.push(`idWilayah=${idWilayah}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  console.log({url})
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
  AddKeluarga,
  getKeluargaById
};
