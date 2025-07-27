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
  const body = {
    namaLengkap: formData.NamaLengkap,
    tanggalLahir: formData.TanggalLahir,
    tanggalBaptis: formData.TanggalBaptis,
    keterangan: formData.Keterangan,
    status: formData.Status,
    jenisKelamin: formData.JenisKelamin,
    hubungan: formData.Hubungan,
    idKeluarga: formData.IdKeluarga,
    isBaptis: formData.IsBaptis,
    noTelp: formData.NoTelp,
    alasanBelumBaptis: formData.AlasanBelumBaptis
  }
  const url = `/anggota/add`;
  try {
    const response = await api.post(url, body); // Menggunakan api.post yang sudah ada interceptornya
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const AddAnggota2 = async (formData) => { // ini add anggota dari keluarga ada perbedaan inputan
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
  const body = {
    id: formData.Id,
    namaLengkap: formData.NamaLengkap,
    tanggalLahir: formData.TanggalLahir,
    tanggalBaptis: formData.TanggalBaptis,
    keterangan: formData.Keterangan,
    status: formData.Status,
    jenisKelamin: formData.JenisKelamin,
    hubungan: formData.Hubungan,
    idKeluarga: formData.IdKeluarga,
    isKepalaKeluarga: formData.IsKepalaKeluarga,
    noTelp: formData.NoTelp,
    isBaptis: formData.IsBaptis,
    alasanBelumBaptis: formData.AlasanBelumBaptis
  }
  const url = `/anggota/${formData.Id}/update`;
  try {
    const response = await api.patch(url, body);
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
  AddAnggota2,
  UpdateAnggota,
  deleteAnggota
};
