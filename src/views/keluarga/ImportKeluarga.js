import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton
} from "@coreui/react";

import Select from "react-select";
import services from "../../services";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { multiSelectStyles } from "../base/select/selectStyle";
import * as XLSX from "xlsx";
import helper from "../../helper";

const KeluargaDetail = () => {
  const { ketuaLingkungan, ketuaWilayah } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.role);
  const localTheme = useSelector((state) => state.theme.theme);
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
    Status: "HIDUP",
    Keterangan: "Kepala Keluarga",
    Hubungan: "Kepala Keluarga",
    NoTelp: "",
    AlasanBelumBaptis: "",
    IsBaptis: true,
  });
  const [loading, setLoading] = useState(true);
  const [importad, setImported] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
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

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingImport(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // === Ambil nilai spesifik ===
        const noKK = sheet["B2"]?.v || "";
        const alamat = sheet["B3"]?.v || "";
        console.log("no KK", noKK);
        console.log("alamat", alamat);

        // === Ambil kepala keluarga (A6–H6) ===
        const headerRange = XLSX.utils.encode_range({
          s: { r: 5, c: 0 }, // baris ke-6 (index 5), kolom A (index 0)
          e: { r: 5, c: 7 }, // kolom H (index 7)
        });
        const kkRow = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          range: headerRange,
        })[0];

        const kepalaKeluarga = {
          namaLengkap: kkRow?.[3] || "",
          tanggalLahir: helper.parseXlsxDate(kkRow?.[5]) || "",
          tanggalBaptis: helper.parseXlsxDate(kkRow?.[6]) || "",
          jenisKelamin: kkRow?.[7] || "",
          status: kkRow?.[1] || "HIDUP",
          noTelp: kkRow?.[4] || "",
          isBaptis: kkRow?.[2] === "SUDAH" ? true : false,
          alasanBelumBaptis: kkRow?.[8] || "",
        };

        console.log("Kepala Keluarga", kepalaKeluarga);

        // === Ambil anggota (A7–H30) ===
        const anggotaRange = XLSX.utils.encode_range({
          s: { r: 6, c: 0 },
          e: { r: 29, c: 7 },
        });
        const anggotaRows = XLSX.utils
          .sheet_to_json(sheet, {
            header: 1,
            range: anggotaRange,
          })
          .filter((row) =>
            row.some((cell) => cell !== undefined && cell !== "")
          );

        const anggotaList = anggotaRows.map((row) => ({
          keterangan: row?.[0],
          hubungan: row?.[0],
          namaLengkap: row?.[3] || "",
          tanggalLahir: helper.parseXlsxDate(row?.[5]) || "",
          tanggalBaptis: helper.parseXlsxDate(row?.[6]) || "",
          jenisKelamin: row?.[7] || "",
          status: row?.[1] || "HIDUP",
          noTelp: row?.[4] || "",
          isBaptis: row?.[2] === "SUDAH" ? true : false,
          alasanBelumBaptis: row?.[8] || "",
        }));

        // === Bangun JSON akhir ===
        const keluargaData = {
          NoKK: noKK,
          Alamat: alamat,
          KepalaKeluarga: kepalaKeluarga,
          Anggota: anggotaList,
        };

        // Simpan ke state
        setFormData((prev) => ({
          ...prev,
          Nomor: noKK,
          Alamat: alamat,
          NamaKepalaKeluarga: kepalaKeluarga.namaLengkap,
          TanggalLahir: kepalaKeluarga.tanggalLahir,
          TanggalBaptis: kepalaKeluarga.tanggalBaptis,
          JenisKelamin: kepalaKeluarga.jenisKelamin,
          NoTelp: kepalaKeluarga.noTelp,
          IsBaptis: kepalaKeluarga.isBaptis,
          AlasanBelumBaptis: kepalaKeluarga.alasanBelumBaptis,
        }));
        setAnggotaList(anggotaList);
        setImported(true);
      } catch (err) {
        Swal.fire({
            title: "Error!",
            text: "There was an error adding the data.",
            icon: "error",
        });
      } finally {
        setLoadingImport(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loadingAlert = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const keluargaRequest = {
        namaLengkap: formData.NamaKepalaKeluarga,
        tanggalBaptis: formData.TanggalBaptis,
        tanggalLahir: formData.TanggalLahir,
        keterangan: formData.Keterangan,
        jenisKelamin: formData.JenisKelamin,
        status: formData.Status,
        hubungan: formData.Hubungan,
        idWilayah: formData.Wilayah,
        idLingkungan: formData.Lingkungan,
        nomor: formData.Nomor,
        alamat: formData.Alamat,
        noTelp: formData.NoTelp,
        isBaptis: formData.IsBaptis,
        alasanBelumBaptis: formData.AlasanBelumBaptis,
      };

      const responseAddKK = await services.KeluargaService.AddKeluarga(
        keluargaRequest
      );
      // const responseAddKK = 1
      for (const anggota of anggotaList) {
        const anggotaRequest = {
          ...anggota,
          idKeluarga: responseAddKK.Id,
        };

        await services.AnggotaService.AddAnggota2(anggotaRequest);
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
      Keterangan: "Kepala Keluarga",
      Hubungan: "Kepala Keluarga",
      NoTelp: "",
      Status: "HIDUP",
      IsBaptis: true,
      AlasanBelumBaptis: "",
    });
    setAnggotaList([]);
    setImported(false)
    setLingkungan([])
  };

  return (
    <CCard>
      <CCardBody>
        <h1 style={{ textAlign: "center" }}>Import Data Keluarga Anggota</h1>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="fileUpload"
                  className="form-label fw-bold"
                  style={{ display: "block" }}
                >
                  Import File Excel (.xlsx)
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  className="form-control mb-2"
                  disabled={loadingImport}
                  required
                />

                {loadingImport ? (
                  <div className="d-flex align-items-center">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    <span>Sedang membaca file...</span>
                  </div>
                ) : null}
              </div>
              {importad && (
                <CRow className="mt-3">
                  <CCol lg={6} sm={12}>
                    <CFormInput
                      type="text"
                      name="Nomor"
                      floatingLabel="Nomor Kartu Keluarga"
                      value={formData.Nomor}
                      disabled
                      className={`mb-3`}
                      required
                    />
                  </CCol>

                  <CCol lg={6} sm={12}>
                    <CFormInput
                      type="text"
                      name="Alamat"
                      floatingLabel="Alamat"
                      value={formData.Alamat}
                      disabled
                      className={`mb-3`}
                      required
                    />
                  </CCol>
                </CRow>
              )}
              <CRow className="mt-3">
                <CCol lg={6} sm={12}>
                  <Select
                    options={lingkunganOptions}
                    onChange={handleLingkunganChange}
                    value={lingkunganOptions.find(
                      (option) => option.value === formData.Lingkungan
                    )}
                    isDisabled={role === "ketuaLingkungan"}
                    styles={multiSelectStyles(localTheme)}
                    required
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
                    required
                  />
                </CCol>
              </CRow>
              <hr className="my-4" />

              {importad && (
                <>
                  <h5 className="mt-4 mb-3 text-center fw-bold text-primary">
                    Silahkan cek apakah data sudah benar di bawah ini
                  </h5>

                  <CTable bordered responsive hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Keterangan
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Baptis</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Nama Lengkap
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          No. Telp
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Tanggal Lahir
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Tanggal Baptis
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Jenis Kelamin
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Alasan Belum Baptis
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {/* === Kepala Keluarga === */}
                      <CTableRow>
                        <CTableDataCell>1</CTableDataCell>
                        <CTableDataCell>Kepala Keluarga</CTableDataCell>
                        <CTableDataCell>{formData.Status}</CTableDataCell>
                        <CTableDataCell>
                          {formData.IsBaptis ? "Sudah" : "Belum"}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formData.NamaKepalaKeluarga}
                        </CTableDataCell>
                        <CTableDataCell>{formData.NoTelp}</CTableDataCell>
                        <CTableDataCell>{formData.TanggalLahir}</CTableDataCell>
                        <CTableDataCell>
                          {formData.TanggalBaptis}
                        </CTableDataCell>
                        <CTableDataCell>{formData.JenisKelamin}</CTableDataCell>
                        <CTableDataCell>
                          {formData.AlasanBelumBaptis}
                        </CTableDataCell>
                      </CTableRow>

                      {/* === Anggota Keluarga === */}
                      {anggotaList.map((anggota, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 2}</CTableDataCell>
                          <CTableDataCell>{anggota.keterangan}</CTableDataCell>
                          <CTableDataCell>{anggota.status}</CTableDataCell>
                          <CTableDataCell>
                            {anggota.isBaptis ? "Sudah" : "Belum"}
                          </CTableDataCell>
                          <CTableDataCell>{anggota.namaLengkap}</CTableDataCell>
                          <CTableDataCell>{anggota.noTelp}</CTableDataCell>
                          <CTableDataCell>
                            {anggota.tanggalLahir}
                          </CTableDataCell>
                          <CTableDataCell>
                            {anggota.tanggalBaptis}
                          </CTableDataCell>
                          <CTableDataCell>
                            {anggota.jenisKelamin}
                          </CTableDataCell>
                          <CTableDataCell>
                            {anggota.alasanBelumBaptis}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  <CRow className="gy-3">
                    <CCol xs="12" md="12">
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
                </>
              )}
            </CForm>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default KeluargaDetail;
