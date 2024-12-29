import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormSelect,
  CCardSubtitle,
} from "@coreui/react";
import Select from "react-select";
import services from "../../services";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

const KeluargaDetail = () => {
  const { ketuaLingkungan, ketuaWilayah } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.role);
  const [formData, setFormData] = useState({
    NamaKepalaKeluarga: "",
    Lingkungan: "",
    NamaLingkungan: "",
    Wilayah: "",
    NamaWilayah: "",
    Alamat: "",
    TanggalLahir: "",
    TanggalBaptis: "",
    JenisKelamin: "",
    Nomor: "",
    NomorKKGereja: "",
    Status: "HIDUP",
    Keterangan: "Kepala Keluarga",
    Hubungan: "Kepala Keluarga",
    NoTelp: "",
  });
  const [loading, setLoading] = useState(true);
  const [isWithAnggota, setIsWithAnggota] = useState(false);
  const [anggotaList, setAnggotaList] = useState([]);
  const [lingkungan, setLingkungan] = useState([]);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await services.LingkunganService.getAllLingkungan();
        const filteredResponse =
          role === "ketuaWilayah" && ketuaWilayah !== 0
            ? response.filter(
                (lingkungan) => lingkungan.Wilayah.Id === ketuaWilayah
              )
            : response;

        const options = filteredResponse.map((lingkungan) => ({
          value: lingkungan.Id,
          label: lingkungan.NamaLingkungan,
        }));
        setLingkungan(response);
        setLingkunganOptions(options);
        if (role !== "admin" && ketuaLingkungan !== 0) {
          const selectedLingkungan = response.find(
            (lingkungan) => lingkungan.Id === ketuaLingkungan
          );
          setFormData({
            ...formData,
            Lingkungan: selectedLingkungan.Id,
            NamaLingkungan: selectedLingkungan.NamaLingkungan,
            Wilayah: selectedLingkungan.Wilayah.Id,
            NamaWilayah: selectedLingkungan.Wilayah.NamaWilayah,
          });
        }
      } catch (error) {
        console.error("Error fetching Data:", error);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLingkunganChange = (selectedOption) => {
    const selectedLingkungan = lingkungan.find(
      (lingkungan) => lingkungan.Id === selectedOption.value
    );
    setFormData({
      ...formData,
      Lingkungan: selectedLingkungan.Id,
      NamaLingkungan: selectedLingkungan.NamaLingkungan,
      Wilayah: selectedLingkungan.Wilayah.Id,
      NamaWilayah: selectedLingkungan.Wilayah.NamaWilayah,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAnggota = () => {
    setAnggotaList([
      ...anggotaList,
      {
        namaLengkap: "",
        tanggalLahir: "",
        tanggalBaptis: "",
        keterangan: "",
        jenisKelamin: "",
        status: "",
        noTelp: "",
      },
    ]);
    setIsWithAnggota(true);
  };

  const handleAnggotaChange = (e, index) => {
    const { name, value } = e.target;
    let updatedAnggotaList;
    if (name != "keterangan") {
      updatedAnggotaList = anggotaList.map((anggota, idx) =>
        idx === index ? { ...anggota, [name]: value } : anggota
      );
    } else {
      updatedAnggotaList = anggotaList.map((anggota, idx) =>
        idx === index ? { ...anggota, [name]: value, hubungan: value } : anggota
      );
    }
    setAnggotaList(updatedAnggotaList);
  };

  const handleRemoveAnggota = (index) => {
    const updatedAnggotaList = anggotaList.filter((_, idx) => idx !== index);
    setAnggotaList(updatedAnggotaList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loadingAlert = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
        },
      });

      const keluargaRequest = {
        NamaLengkap: formData.NamaKepalaKeluarga,
        TanggalBaptis: formData.TanggalBaptis,
        TanggalLahir: formData.TanggalLahir,
        Keterangan: formData.Keterangan,
        JenisKelamin: formData.JenisKelamin,
        Status: formData.Status,
        Hubungan: formData.Hubungan,
        IdWilayah: formData.Wilayah,
        IdLingkungan: formData.Lingkungan,
        Nomor: formData.Nomor,
        NomorKKGereja: formData.NomorKKGereja,
        Alamat: formData.Alamat,
        NoTelp: formData.NoTelp,
      };

      const responseAddKK = await services.KeluargaService.AddKeluarga(
        keluargaRequest
      );
      for (const anggota of anggotaList) {
        const anggotaRequest = {
          ...anggota,
          idKeluarga: responseAddKK.Id,
        };

        await services.AnggotaService.AddAnggota(anggotaRequest);
      }

      await Swal.fire({
        title: "Success!",
        text: "Data has been added successfully.",
        icon: "success",
      });
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "There was an error adding the data.",
        icon: "error",
      });
    } finally {
      Swal.close();
    }

    // Reset form after submission
    setFormData({
      NamaKepalaKeluarga: "",
      Lingkungan: "",
      NamaLingkungan: "",
      Wilayah: "",
      NamaWilayah: "",
      Alamat: "",
      TanggalLahir: "",
      TanggalBaptis: "",
      JenisKelamin: "",
      Nomor: "",
      NomorKKGereja: "",
      Keterangan: "Kepala Keluarga",
      Hubungan: "Kepala Keluarga",
      NoTelp: "",
      Status: "HIDUP",
    });
    setAnggotaList([]);
    setIsWithAnggota(false);
  };

  return (
    <CCard>
      <CCardBody>
        <h1 style={{ textAlign: "center" }}>Add Keluarga Anggota</h1>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mt-3">
                <CCol lg={3} sm={12}>
                  <CFormInput
                    type="text"
                    name="Nomor"
                    floatingLabel="Nomor Kartu Keluarga"
                    value={formData.Nomor}
                    onChange={handleChange}
                    className={`mb-3 bg-white`}
                  />
                </CCol>

                <CCol lg={3} sm={12}>
                  <CFormInput
                    type="text"
                    name="NomorKKGereja"
                    floatingLabel="Nomor KK Gereja"
                    value={formData.NomorKKGereja}
                    onChange={handleChange}
                    className={`mb-3 bg-white`}
                  />
                </CCol>

                <CCol lg={6} sm={12}>
                  <CFormInput
                    type="text"
                    name="Alamat"
                    floatingLabel="Alamat"
                    value={formData.Alamat}
                    onChange={handleChange}
                    className={`mb-3 bg-white`}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol lg={6} sm={12}>
                  <Select
                    options={lingkunganOptions}
                    onChange={handleLingkunganChange}
                    value={lingkunganOptions.find(
                      (option) => option.value === formData.Lingkungan
                    )}
                    isDisabled={role === "ketuaLingkungan"}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: "100%",
                        marginBottom: "35px",
                        borderColor: "blue",
                      }),
                      control: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        borderColor: "#ced4da",
                        borderWidth: "1px",
                        borderRadius: "0.375rem",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050,
                      }),
                    }}
                  />
                </CCol>
                <CCol lg={6} sm={12}>
                  <CFormInput
                    type="text"
                    name="Wilayah"
                    floatingLabel="Wilayah"
                    value={formData.NamaWilayah}
                    disabled
                    className="mb-3 border-0"
                  />
                </CCol>
              </CRow>
              <hr className="my-4" />

              {/* Bagian Kedua: Add Kepala keluarga */}
              <CCard className="mt-3">
                <CCardBody>
                  <CCardSubtitle
                    className="mb-2 text-body-secondary"
                    style={{ marginLeft: "3px" }}
                  >
                    Kepala Keluarga
                  </CCardSubtitle>
                  {/* Baris Pertama */}
                  <CRow>
                    <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                      <CFormInput
                        type="text"
                        name="NamaKepalaKeluarga"
                        floatingLabel="Nama Lengkap"
                        required
                        onChange={handleChange}
                        value={formData.NamaKepalaKeluarga}
                      />
                    </CCol>
                    <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                      <CFormInput
                        type="text"
                        name="NoTelp"
                        floatingLabel="No Telepon"
                        required
                        onChange={handleChange}
                        value={formData.NoTelp}
                      />
                    </CCol>
                    <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                      <CFormInput
                        type="text"
                        name="Keterangan"
                        floatingLabel="Keterangan"
                        value="Kepala Keluarga"
                        disabled
                      />
                    </CCol>
                  </CRow>

                  {/* Baris Kedua */}
                  <CRow className="mt-3">
                    <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                      <CFormInput
                        type="date"
                        name="TanggalLahir"
                        floatingLabel="Tanggal Lahir"
                        onChange={handleChange}
                        required
                        value={formData.TanggalLahir}
                      />
                    </CCol>
                    <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                      <CFormInput
                        type="date"
                        name="TanggalBaptis"
                        floatingLabel="Tanggal Baptis"
                        onChange={handleChange}
                        required
                        value={formData.TanggalBaptis}
                      />
                    </CCol>
                    <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                      <CFormSelect
                        id="jenisKelamin"
                        name="JenisKelamin"
                        value={formData.JenisKelamin}
                        onChange={handleChange}
                        required
                        floatingClassName="mb-3"
                        floatingLabel="Jenis Kelamin"
                      >
                        <option value="">Jenis Kelamin</option>
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                      <CFormSelect
                        id="status"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        required
                        disabled
                        floatingClassName="mb-3"
                        floatingLabel="Status"
                      >
                        <option value="">Status</option>
                        <option value="HIDUP">Hidup</option>
                        <option value="MENINGGAL">Meninggal</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <hr className="my-4" />

              {/* Form Anggota tambahan jika isWithAnggota true */}
              {isWithAnggota &&
                anggotaList.map((anggota, index) => (
                  <CCard className="mt-3" key={index}>
                    <CCardBody>
                      <div className="d-flex justify-content-between align-items-center">
                        <CCardSubtitle
                          className="mb-2 text-body-secondary"
                          style={{ marginLeft: "3px" }}
                        >
                          {`Anggota ${index + 1}`}
                        </CCardSubtitle>
                        <CButton
                          color="danger"
                          onClick={() => handleRemoveAnggota(index)}
                          style={{
                            fontSize: "16px",
                            lineHeight: "1",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "0.375rem",
                            marginBottom: "5px",
                            color: "white",
                            fontWeight: "bold",
                            transition: "0.3s",
                          }}
                        >
                          &times;
                        </CButton>
                      </div>

                      {/* Baris Pertama */}
                      <CRow>
                        <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                          <CFormInput
                            type="text"
                            name="namaLengkap"
                            floatingLabel="Nama Lengkap"
                            required
                            value={anggota.namaLengkap}
                            onChange={(e) => handleAnggotaChange(e, index)}
                          />
                        </CCol>
                        <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                          <CFormInput
                            type="text"
                            name="noTelp"
                            floatingLabel="No Telepon"
                            required
                            value={anggota.noTelp}
                            onChange={(e) => handleAnggotaChange(e, index)}
                          />
                        </CCol>
                        <CCol xs={12} sm={12} md={12} lg={4} xl={4}>
                          <CFormSelect
                            id="keterangan"
                            name="keterangan"
                            value={anggota.keterangan}
                            onChange={(e) => handleAnggotaChange(e, index)}
                            required
                            floatingClassName="mb-3"
                            floatingLabel="Keterangan"
                          >
                            <option value="">Select Keterangan</option>
                            <option value="Istri">Istri</option>
                            <option value="Anak">Anak</option>
                            <option value="Anggota">Anggota</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>

                      {/* Baris Kedua */}
                      <CRow className="mt-3">
                        <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                          <CFormInput
                            type="date"
                            name="tanggalLahir"
                            floatingLabel="Tanggal Lahir"
                            required
                            value={anggota.tanggalLahir}
                            onChange={(e) => handleAnggotaChange(e, index)}
                          />
                        </CCol>
                        <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                          <CFormInput
                            type="date"
                            name="tanggalBaptis"
                            floatingLabel="Tanggal Baptis"
                            required
                            value={anggota.tanggalBaptis}
                            onChange={(e) => handleAnggotaChange(e, index)}
                          />
                        </CCol>
                        <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                          <CFormSelect
                            id="jenisKelaminAnggota"
                            name="jenisKelamin"
                            value={anggota.jenisKelamin}
                            onChange={(e) => handleAnggotaChange(e, index)}
                            required
                            floatingClassName="mb-3"
                            floatingLabel="Jenis Kelamin"
                          >
                            <option value="">Select Jenis Kelamin</option>
                            <option value="L">Laki-Laki</option>
                            <option value="P">Perempuan</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={12} sm={12} md={12} lg={3} xl={3}>
                          <CFormSelect
                            id="anggotaStatus"
                            name="status"
                            value={anggota.status}
                            onChange={(e) => handleAnggotaChange(e, index)}
                            required
                            floatingClassName="mb-3"
                            floatingLabel="Status"
                          >
                            <option value="">Select Status</option>
                            <option value="HIDUP">Hidup</option>
                            <option value="MENINGGAL">Meninggal</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                ))}

              <CRow className="gy-3">
                <CCol xs="12" md="6">
                  <CButton
                    color="success"
                    onClick={handleAddAnggota}
                    className="w-100"
                    style={{
                      height: "100%",
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                      marginRight: "10px",
                    }}
                  >
                    Add Anggota
                  </CButton>
                </CCol>

                <CCol xs="12" md="6">
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
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default KeluargaDetail;
