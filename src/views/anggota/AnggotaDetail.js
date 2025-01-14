import React, { useState, useEffect } from "react";

import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSelect,
  CCardSubtitle,
  CRow,
  CCol,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import services from "../../services";
import Select from "react-select";
import { useAuth } from "../../hooks/useAuth";
import { useRedirect } from "../../hooks/useRedirect";
import useHandleBack from "../../hooks/useHandleBack";

const AnggotaDetail = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectToBefore } = useRedirect();
  const { data } = location.state || {};

  const [formData, setFormData] = useState({
    Id: "",
    NamaLengkap: "",
    TanggalLahir: "",
    TanggalBaptis: "",
    Keterangan: "",
    Status: "",
    JenisKelamin: "",
    Hubungan: "",
    IdKeluarga: "",
    IsKepalaKeluarga: "",
    NoTelp: "",
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [idKeluarga, setIdKeluarga] = useState(data ? data.keluarga.Id : "");
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [keluargaData, setKeluargaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [namaWilayah, setNamaWilayah] = useState(
    data ? data.keluarga.Wilayah.NamaWilayah : ""
  );
  const [namaLingkungan, setNamaLingkungan] = useState(
    data ? data.keluarga.Lingkungan.NamaLingkungan : ""
  );

  useHandleBack("/anggota");
  useEffect(() => {
    if (!data || !data.anggota) {
      redirectToBefore();
    }
    if (data && data.anggota) {
      const dataBaru = {
        Id: data.anggota.Id,
        NamaLengkap: data.anggota.NamaLengkap,
        TanggalLahir: data.anggota.TanggalLahir.split("T")[0],
        TanggalBaptis: data.anggota.TanggalBaptis.split("T")[0],
        Keterangan: data.anggota.Keterangan,
        Status: data.anggota.Status,
        NoTelp: data.anggota.NoTelp,
        JenisKelamin: data.anggota.JenisKelamin,
        IdKeluarga: data.keluarga.Id,
        IsKepalaKeluarga: data.isKepalaKeluarga,
      };
      setFormData(dataBaru);
      setInitialFormData(dataBaru);
    }
  }, [data]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const keluargaData = await services.KeluargaService.getAllKeluarga();
        setKeluargaData(keluargaData);
        const formattedOptions = keluargaData.map((option) => ({
          value: option.Id,
          label: `Keluarga ${option.KepalaKeluarga.NamaLengkap} - ${option.Nomor}`,
        }));
        setKeluargaOptions(formattedOptions);
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  if (error) return <p>Error fetching data.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeKeterangan = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      Hubungan: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleKeluargaChange = (selectedOption) => {
    setIdKeluarga(selectedOption);
    const selectedKeluarga = keluargaData.find(
      (option) => option.Id === selectedOption.value
    );
    if (selectedKeluarga) {
      setNamaWilayah(selectedKeluarga.Wilayah.NamaWilayah);
      setNamaLingkungan(selectedKeluarga.Lingkungan.NamaLingkungan);
    } else {
      setNamaWilayah("");
      setNamaLingkungan("");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const loadingAlert = Swal.fire({
          title: "Loading...",
          text: "Please wait...",
          allowOutsideClick: false,
        });
        const response = await services.AnggotaService.deleteAnggota(
          data.anggota.Id
        );
        console.log({ response });

        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(navigate("/keluarga"));
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Loading...",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
      },
    });

    try {
      const response = await services.AnggotaService.UpdateAnggota(formData);
      let updatedData = {};
      if (data.isFromKeluargaDetail) {
        updatedData = data.keluarga.Anggota.map((item) => {
          return item.Id === response.Id ? { ...item, ...response } : item;
        });
        const updatedKeluarga = {
          ...data.keluarga,
          Anggota: updatedData,
        };
        await Swal.fire({
          title: "Success!",
          text: "Data has been updated successfully.",
          icon: "success",
        }).then(() => {
          navigate(`/keluarga/${data.keluarga.Id}`, {
            state: { data: updatedKeluarga },
          });
        });
      } else {
        await Swal.fire({
          title: "Success!",
          text: "Data has been updated successfully.",
          icon: "success",
        }).then(() => {
          navigate("/keluarga");
        });
      }
    } catch (error) {
      setFormData(initialFormData);

      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error updating the data.",
          icon: "error",
        });
      }
    } finally {
      Swal.close();
      setIsEditable(false);
    }
  };

  return (
    <CCard>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CCardSubtitle
                className="mb-2 text-body-secondary"
                style={{ marginLeft: "3px" }}
              >
                Detail Anggota
              </CCardSubtitle>
              <CButton
                color="danger"
                onClick={() => {
                  handleDelete();
                }}
                style={{
                  fontSize: "16px",
                  lineHeight: "1",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.375rem",
                  marginBottom: "9px",
                  color: "white",
                  fontWeight: "bold",
                  transition: "0.3s",
                }}
              >
                Delete
              </CButton>
            </div>
            <CForm onSubmit={handleSubmit}>
              <CFormInput
                type="text"
                id="idAnggota"
                floatingLabel="ID Anggota"
                name="Id"
                value={formData.Id}
                onChange={handleChange}
                disabled
                className="mb-3"
              />

              <Select
                options={keluargaOptions}
                value={keluargaOptions.find(
                  (option) => option.value === data.keluarga.Id
                )}
                onChange={handleKeluargaChange}
                placeholder="Select Keluarga"
                isSearchable
                isDisabled={true}
                // isDisabled={!isEditable || data.isKepalaKeluarga} // sementara di disable karena tidak terhandle di backend untuk update
                styles={{
                  container: (base) => ({
                    ...base,
                    width: "100%",
                    marginBottom: "1rem",
                  }),
                  control: (base) => ({
                    ...base,
                    borderWidth: "1px",
                    borderRadius: "0.375rem",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 1050,
                  }),
                }}
                required
              />

              <CFormInput
                type="text"
                id="idWilayah"
                placeholder="Wilayah"
                value={namaWilayah}
                disabled
                floatingClassName="mb-3"
                floatingLabel="Wilayah"
              />

              <CFormInput
                type="text"
                id="idLingkungan"
                placeholder="Lingkungan"
                value={namaLingkungan}
                disabled
                floatingClassName="mb-3"
                floatingLabel="Lingkungan"
              />

              {/* Input Nama Lengkap */}
              <CFormInput
                type="text"
                id="namaLengkap"
                floatingLabel="Nama Lengkap"
                name="NamaLengkap"
                value={formData.NamaLengkap}
                onChange={handleChange}
                disabled={!isEditable}
                className="mb-3"
              />

              <CFormInput
                type="text"
                id="noTelp"
                floatingLabel="No Telp"
                name="NoTelp"
                value={formData.NoTelp}
                onChange={handleChange}
                disabled={!isEditable}
                className="mb-3"
              />

              {/* Input Tanggal Lahir */}
              <CFormInput
                type="date"
                id="tanggalLahir"
                floatingLabel="Tanggal Lahir"
                name="TanggalLahir"
                value={formData.TanggalLahir}
                onChange={handleChange}
                disabled={!isEditable}
                className="mb-3"
              />

              {/* Input Tanggal Baptis */}
              <CFormInput
                type="date"
                id="tanggalBaptis"
                floatingLabel="Tanggal Baptis"
                name="TanggalBaptis"
                value={formData.TanggalBaptis}
                onChange={handleChange}
                disabled={!isEditable}
                className="mb-3"
              />

              <CFormSelect
                id="jenisKelamin"
                name="JenisKelamin"
                value={formData.JenisKelamin}
                onChange={handleChange}
                required
                floatingClassName="mb-3"
                floatingLabel="Status"
                disabled={!isEditable}
              >
                <option value="">Jenis Kelamin</option>
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </CFormSelect>

              <CFormSelect
                id="keterangan"
                name="Keterangan"
                value={formData.Keterangan}
                onChange={handleChangeKeterangan}
                required
                floatingClassName="mb-3"
                floatingLabel="Keterangan"
                disabled={!isEditable || data.isKepalaKeluarga}
              >
                <option value="">
                  {data && data.isKepalaKeluarga
                    ? "Kepala Keluarga"
                    : formData.Keterangan}
                </option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Anggota">Anggota</option>
              </CFormSelect>

              <CFormSelect
                id="status"
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                required
                floatingClassName="mb-3"
                floatingLabel="Status"
                disabled={!isEditable}
              >
                <option value="">Select Status</option>
                <option value="HIDUP">Hidup</option>
                <option value="MENINGGAL">Meninggal</option>
              </CFormSelect>
              <CRow className="gy-3">
                {/* Tombol Back */}
                <CCol xs="12" md="4">
                  <CButton
                    color="secondary"
                    onClick={handleBack}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Back
                  </CButton>
                </CCol>

                {/* Tombol Edit */}
                <CCol xs="12" md="4">
                  <CButton
                    color="info"
                    onClick={handleEdit}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Edit
                  </CButton>
                </CCol>

                {/* Tombol Submit */}
                <CCol xs="12" md="4">
                  <CButton
                    color="primary"
                    type="submit"
                    disabled={!isEditable}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </>
      )}
    </CCard>
  );
};

export default AnggotaDetail;
