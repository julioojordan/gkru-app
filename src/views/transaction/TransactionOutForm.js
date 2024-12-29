import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";
import Select from "react-select";
import Swal from "sweetalert2";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";

const TransactionOutForm = () => {
  const { handleLogout } = useAuth();
  const [nominal, setNominal] = useState("");
  const [idKeluarga, setIdKeluarga] = useState(null);
  const [namaWilayah, setNamaWilayah] = useState("");
  const [namaLingkungan, setNamaLingkungan] = useState("");
  const [subKeterangan, setSubKeterangan] = useState("");
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [keluarga, setKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileBukti, setFileBukti] = useState(null);
  const [error, setError] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 2MB
  const VALID_FORMATS = ["image/jpeg", "image/png", "image/webp"];

  const CURRENT_YEAR = new Date().getFullYear();
  const CURRENT_MONTH = new Date().getMonth() + 1;
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const keluargaData = await services.KeluargaService.getAllKeluarga();
        setKeluarga(keluargaData);
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

  const handleKeluargaChange = (selectedOption) => {
    setIdKeluarga(selectedOption);
    const selectedKeluarga = keluarga.find(
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cek ukuran file
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: "Error!",
          text: `File size exceeds the maximum limit of 2MB.`,
          icon: "error",
        });
        return;
      }

      // Cek format file
      if (!VALID_FORMATS.includes(file.type)) {
        Swal.fire({
          title: "Error!",
          text: "Invalid file format. Only JPG, PNG, and WebP are allowed.",
          icon: "error",
        });
        return;
      }

      setFileBukti(file); // Jika valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdBy = 1;
    const createdDate = new Date().toISOString();

    let data = {
      Nominal: parseInt(nominal, 10),
      Keterangan: "OUT",
      CreatedBy: createdBy,
      SubKeterangan: subKeterangan,
      CreatedDate: createdDate,
      Tahun: year,
      Bulan: month,
      IdKeluarga: idKeluarga.value,
    };

    if (fileBukti) {
      data.FileBukti = fileBukti;
    }

    try {
      const loadingAlert = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
        },
      });

      await services.HistoryService.addHistory(data);

      await Swal.fire({
        title: "Success!",
        text: "Data has been added successfully.",
        icon: "success",
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

    // Reset form after submission
    setNominal("");
    setIdKeluarga(null);
    setNamaWilayah("");
    setNamaLingkungan("");
    setSubKeterangan("");
    setFileBukti(null);
  };

  return (
    <CForm onSubmit={handleSubmit}>
      {loading ? (
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <CFormSelect
            id="tahun"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            floatingClassName="mb-3"
            floatingLabel="Tahun"
          >
            <option value="">Select Tahun</option>
            <option value={CURRENT_YEAR - 2}>{CURRENT_YEAR - 2}</option>
            <option value={CURRENT_YEAR - 1}>{CURRENT_YEAR - 1}</option>
            <option value={CURRENT_YEAR}>{CURRENT_YEAR}</option>
            <option value={CURRENT_YEAR + 1}>{CURRENT_YEAR + 1}</option>
            <option value={CURRENT_YEAR + 2}>{CURRENT_YEAR + 2}</option>
          </CFormSelect>
          <CFormSelect
            id="bulan"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            required
            floatingClassName="mb-3"
            floatingLabel="Bulan"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {monthNames[month - 1]}
              </option>
            ))}
          </CFormSelect>

          <CFormInput
            type="number"
            id="nominal"
            placeholder="Nominal"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            required
            floatingClassName="mb-3"
            floatingLabel="Nominal"
            step={50000}
          />

          <Select
            options={keluargaOptions}
            value={idKeluarga}
            onChange={handleKeluargaChange}
            placeholder="Select Keluarga"
            isSearchable
            styles={{
              container: (base) => ({
                ...base,
                width: "100%",
                marginBottom: "1rem",
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
            required
          />

          <CFormInput
            type="text"
            id="idWilayah"
            placeholder="Wilayah"
            value={namaWilayah}
            onChange={() => {}}
            required
            disabled
            floatingClassName="mb-3"
            floatingLabel="Wilayah"
          />

          <CFormInput
            type="text"
            id="idLingkungan"
            placeholder="Lingkungan"
            value={namaLingkungan}
            onChange={() => {}}
            required
            disabled
            floatingClassName="mb-3"
            floatingLabel="Lingkungan"
          />

          <CFormInput
            type="text"
            id="subKeterangan"
            placeholder="Sub Keterangan (Optional)"
            value={subKeterangan}
            onChange={(e) => setSubKeterangan(e.target.value)}
            floatingClassName="mb-3"
            floatingLabel="Sub Keterangan"
          />

          <CFormInput
            type="file"
            id="fileBukti"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            floatingClassName="mb-3"
            floatingLabel="File Bukti (Optional)"
          />

          <CRow className="gy-3 justify-content-center">
            <CCol xs="12" md="12" xl="6">
              <CButton type="submit" color="primary" className="w-100">
                Submit
              </CButton>
            </CCol>
          </CRow>
        </>
      )}
    </CForm>
  );
};

export default TransactionOutForm;
