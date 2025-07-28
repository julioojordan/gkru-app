import api from "./Api";

const getTotalIncome = async () => {
  const url = "/history/getTotalIncome";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getTotalOutcome = async () => {
  const url = "/history/getTotalOutcome";
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistory = async () => {
  const url = "/history";
  try {
    const response = await api.get(url);
    if (response.data.data) {
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistoryWithKeluargaContext = async (year) => {
  const url = `/historyWithContext?tahun=${year}`;
  try {
    const response = await api.get(url);
    if (response.data.data) {
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistorySetoran = async (year, month) => {
  const url = `/historySetoran?tahun=${year}&bulan=${month}`;
  try {
    const response = await api.get(url);
    if (response.data.data) {
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistoryWithIdKeluarga = async (idKeluarga, year) => {
  let url = `/history?idKeluarga=${idKeluarga}`;
  if (year) {
    url = `/history?idKeluarga=${idKeluarga}&tahun=${year}`;
  }
  try {
    const response = await api.get(url);
    if (response.data.data) {
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getAllHistoryWithTimeFilter = async (
  idLingkungan,
  IdWilayah,
  month,
  year
) => {
  let url = `/historyWithTimeFilter?bulan=${month}&tahun=${year}`;
  if (idLingkungan && idLingkungan !== 0) {
    url += `&idLingkungan=${idLingkungan}`;
  }
  if (IdWilayah && IdWilayah !== 0) {
    url += `&idWilayah=${IdWilayah}`;
  }
  try {
    const response = await api.get(url);
    if (response.data.data) {
      return Promise.resolve(response.data.data);
    } else {
      return Promise.resolve([]);
    }
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getDetailHistory = async (id) => {
  const url = `/history/${id}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const getHistoryByGroup = async (id) => {
  const url = `/historyByGroup?idGroup=${id}`;
  try {
    const response = await api.get(url);
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const addHistory = async (data, kodeLingkungan) => {
  const formData = new FormData();
  formData.append("History", JSON.stringify(data));
  // formData.append("Nominal", data.Nominal);
  // formData.append("IdKeluarga", data.IdKeluarga);
  // formData.append("Keterangan", data.Keterangan);
  // formData.append("CreatedBy", data.CreatedBy);
  // formData.append("SubKeterangan", data.SubKeterangan);
  // formData.append("Bulan", data.Bulan);
  // formData.append("Tahun", data.Tahun);
  if (data.FileBukti) {
    formData.append("FileBukti", data.FileBukti);
  }
  formData.append("KodeLingkungan", kodeLingkungan);
  const url = "/history/add";
  try {
    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

const addHistoryIuran = async (data, bukti, kodeLingkungan) => {
  const formData = new FormData();
  formData.append("History", JSON.stringify(data)); // Pastikan data adalah JSON array
  if (bukti) {
    formData.append("FileBukti", bukti); // Lampirkan file jika ada
  }
  formData.append("KodeLingkungan", kodeLingkungan);
  const url = "/history/addIuran";
  try {
    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return Promise.resolve(response.data.data);
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(error);
  }
};

export default {
  getTotalIncome,
  getTotalOutcome,
  getAllHistory,
  getDetailHistory,
  addHistory,
  getAllHistoryWithIdKeluarga,
  getAllHistoryWithKeluargaContext,
  getAllHistorySetoran,
  getAllHistoryWithTimeFilter,
  addHistoryIuran,
  getHistoryByGroup
};
