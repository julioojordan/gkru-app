import React, { useState } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSelect,
  CRow,
  CCol,
  CFormCheck,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";

const AddAnggota = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: { Id, Lingkungan, Wilayah, KepalaKeluarga, Nomor },
  } = location.state || {};

  const [formData, setFormData] = useState({
    NamaLengkap: "",
    TanggalLahir: "",
    TanggalBaptis: "",
    Keterangan: "",
    Status: "",
    JenisKelamin: "",
    Hubungan: "",
    IdKeluarga: Id,
    NoTelp: "",
    AlasanBelumBaptis: "",
    IsBaptis: true,
  });
  const [namaWilayah] = useState(Wilayah.NamaWilayah);
  const [namaLingkungan] = useState(Lingkungan.NamaLingkungan);

  const handleBaptisChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      IsBaptis: value,
      // Reset tanggal dan alasan ke initial untuk setiap toggle
      TanggalBaptis: value ? formData.TanggalBaptis : "",
      AlasanBelumBaptis: value ? null : formData.AlasanBelumBaptis,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value == "" ? "-" : value,
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
      const response = await services.AnggotaService.AddAnggota(formData);
      const newAnggota = {
        Id: response.Id,
        NamaLengkap: formData.NamaLengkap,
        TanggalLahir: formData.TanggalLahir,
        TanggalBaptis: formData.TanggalBaptis,
        Keterangan: formData.Keterangan,
        Status: formData.Status,
        JenisKelamin: formData.JenisKelamin,
        NoTelp: formData.NoTelp,
        AlasanBelumBaptis: formData.AlasanBelumBaptis,
        IsBaptis: formData.IsBaptis,
      };
      const newData = {
        ...location.state.data,
        Anggota: [...location.state.data.Anggota, newAnggota],
      };

      await Swal.fire({
        title: "Success!",
        text: "Data has been added successfully.",
        icon: "success",
      }).then(() => {
        navigate(`/keluarga/${Id}`, { state: { data: newData } });
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error adding the data.",
          icon: "error",
        });
      }
    } finally {
      Swal.close();
    }
  };

  return (
    <CCard>
      <CCardBody>
        <h5>Add Anggota</h5>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            type="text"
            id="idKeluarga"
            floatingLabel="Keluarga"
            name="idKeluarga"
            value={`Keluarga ${KepalaKeluarga.NamaLengkap} - ${Nomor}`}
            disabled
            className="mb-3"
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
            className="mb-3"
            required
          />

          <CFormInput
            type="text"
            id="noTelp"
            floatingLabel="No Telp (Optional)"
            name="NoTelp"
            value={formData.NoTelp}
            onChange={handleChange}
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
            className="mb-3"
            required
          />

          {/* Input Tanggal Baptis */}
          <CFormCheck
            inline
            type="radio"
            id="bptSudah"
            name="bpt"
            label="Sudah Baptis"
            checked={formData.IsBaptis == true}
            onChange={() => handleBaptisChange(true)}
            className="mb-3"
          />
          <CFormCheck
            inline
            type="radio"
            id="bptBelum"
            name="bpt"
            label="Belum Baptis"
            checked={formData.IsBaptis == false}
            onChange={() => handleBaptisChange(false)}
            className="mb-3"
          />
          {formData.IsBaptis ? (
            <CFormInput
              type="date"
              id="tanggalBaptis"
              floatingLabel="Tanggal Baptis"
              name="TanggalBaptis"
              value={formData.TanggalBaptis}
              onChange={handleChange}
              className="mb-3"
            />
          ) : (
            <CFormInput
              type="text"
              id="alasanBelumBaptis"
              floatingLabel="Alasan Belum Baptis"
              name="AlasanBelumBaptis"
              value={formData.AlasanBelumBaptis}
              onChange={handleChange}
              className="mb-3"
            />
          )}

          <CFormSelect
            id="jenisKelamin"
            name="JenisKelamin"
            value={formData.JenisKelamin}
            onChange={handleChange}
            required
            floatingClassName="mb-3"
            floatingLabel="Status"
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
          >
            <option value="">Select Keterangan</option>
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
          >
            <option value="">Select Status</option>
            <option value="HIDUP">Hidup</option>
            <option value="MENINGGAL">Meninggal</option>
          </CFormSelect>

          <CRow className="gy-3">
            <CCol xs="12" md="6">
              <CButton
                color="secondary"
                onClick={handleBack}
                className="w-100"
                style={{
                  height: "100%",
                  fontSize: "0.9rem",
                  padding: "10px 0",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  transition: "0.3s",
                }}
              >
                Back
              </CButton>
            </CCol>
            <CCol xs="12" md="6">
              {/* Tombol Submit */}
              <CButton
                color="primary"
                type="submit"
                className="w-100"
                style={{
                  height: "100%",
                  fontSize: "0.9rem",
                  padding: "10px 0",
                  color: "white",
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
    </CCard>
  );
};

export default AddAnggota;
