import React, { useState, useEffect, useRef } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CRow,
  CCol,
  CAlert,
} from "@coreui/react";
import Select from "react-select";
import Swal from "sweetalert2";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import helper from "../../helper";

const TransactionInForm = () => {
  const { handleLogout } = useAuth();
  const fileInputRef = useRef(null);
  const { ketuaLingkungan, ketuaWilayah } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.role);
  const [nominal, setNominal] = useState("");
  const [idLingkungan, setIdLingkungan] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [subKeterangan, setSubKeterangan] = useState("");
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingKeluarga, setLoadingKeluarga] = useState(true);
  const [selectedKeluarga, setSelectedKeluarga] = useState([]);
  const [fileBukti, setFileBukti] = useState(null);
  const [error, setError] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 2MB maks
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

  const [lingkungan, setLingkungan] = useState([]);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const responseLingkungan =
          await services.LingkunganService.getAllLingkungan();
        const filteredResponseLingkungan =
          role === "ketuaWilayah" && ketuaWilayah !== 0
            ? responseLingkungan.filter(
                (lingkungan) => lingkungan.Wilayah.Id === ketuaWilayah
              )
            : responseLingkungan;

        const options = filteredResponseLingkungan.map((lingkungan) => ({
          value: lingkungan.Id,
          label: lingkungan.NamaLingkungan,
        }));
        setLingkungan(responseLingkungan);
        setLingkunganOptions(options);
        if (role !== "admin" && ketuaLingkungan !== 0) {
          const selectedLingkungan = responseLingkungan.find(
            (lingkungan) => lingkungan.Id === ketuaLingkungan
          );
          setIdLingkungan(selectedLingkungan.Id);
          setNamaWilayah(selectedLingkungan.Wilayah.NamaWilayah);
        }
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const responseHistory =
          await services.HistoryService.getAllHistoryWithTimeFilter(
            ketuaLingkungan,
            ketuaWilayah,
            month,
            year
          );
        setHistory(responseHistory);
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [year, month, idLingkungan]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingKeluarga(true);
      try {
        const keluargaData = await services.KeluargaService.getAllKeluarga(
          ketuaLingkungan,
          ketuaWilayah
        );
        const historyIds = history
          .filter((item) => item.Keterangan === "IN")
          .map((item) => item.IdKeluarga);

        const filteredKeluarga = keluargaData.filter(
          (keluarga) =>
            !historyIds.includes(keluarga.Id) &&
            keluarga.Lingkungan.Id === idLingkungan &&
            keluarga.Status === "aktif"
        );
        const formattedOptions = filteredKeluarga.map((option) => ({
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
        setLoadingKeluarga(false);
      }
    };

    fetchOptions();
  }, [history]);

  if (error) return <p>Error fetching data.</p>;

  const handleLingkunganChange = (selectedOption) => {
    const selectedLingkungan = lingkungan.find(
      (lingkungan) => lingkungan.Id === selectedOption.value
    );
    setIdLingkungan(selectedLingkungan.Id);
    setNamaWilayah(selectedLingkungan.Wilayah.NamaWilayah);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cek ukuran file
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: "Error!",
          text: `Ukuran file melebihi limit 2MB.`,
          icon: "error",
        });
        return;
      }

      // Cek format file
      if (!VALID_FORMATS.includes(file.type)) {
        Swal.fire({
          title: "Error!",
          text: "Format File tidak sesuai. hanya JPG, PNG, and WebP yang dibolehkan.",
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
    let bukti = null;

    let data = {
      Nominal: parseInt(nominal, 10),
      Keterangan: "IN",
      CreatedBy: createdBy,
      SubKeterangan: subKeterangan,
      CreatedDate: createdDate,
      Tahun: year,
      Bulan: month,
    };

    if (fileBukti) {
      bukti = fileBukti;
    }

    if (nominal % 10000 !== 0) {
      await Swal.fire({
        title: "Error!",
        text: `Nominal: ${helper.FormatToRupiah.formatToRupiah(
          nominal
        )} tidak valid, nominal harus merupakan kelipatan dari Rp 10.000 !`,
        icon: "error",
      });
      Swal.close();
      setFileBukti(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const totalKeluarga = selectedKeluarga.length;
    const nominalPerKeluarga = Math.floor(
      parseInt(nominal, 10) / totalKeluarga
    );

    if (totalKeluarga * 10000 < parseInt(nominal, 10)) {
      const deficiency = parseInt(nominal, 10) / 10000 - totalKeluarga;
      await Swal.fire({
        title: "Error!",
        text: `Jumlah Keluarga yang dipilih kurang ${deficiency} keluarga`,
        icon: "error",
      });
      Swal.close();
      setFileBukti(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      return;
    }
    const requests = selectedKeluarga.map((keluarga) => ({
      ...data,
      Nominal: nominalPerKeluarga,
      IdKeluarga: parseInt(keluarga.value, 10),
    }));

    try {
      const loadingAlert = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
        },
      });

      await services.HistoryService.addHistoryIuran(requests, bukti);

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
    setIdLingkungan("");
    setNamaWilayah("");
    setSubKeterangan("");
    setSelectedKeluarga([]);
    setFileBukti(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
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

          <Select
            options={lingkunganOptions}
            onChange={handleLingkunganChange}
            value={lingkunganOptions.find(
              (option) => option.value === idLingkungan
            )}
            placeholder="Pilih Lingkungan"
            isDisabled={role === "ketuaLingkungan"}
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
          />

          {keluargaOptions.length === 0 && idLingkungan && (
            <CAlert color="success">
              Semua Keluarga Anggota telah membayar iuran pada bulan ini
            </CAlert>
          )}

          <CFormInput
            type="text"
            name="Wilayah"
            placeholder="Wilayah"
            value={namaWilayah}
            disabled
            floatingClassName="mb-3"
            floatingLabel="Wilayah"
          />

          <CFormInput
            type="number"
            id="nominal"
            placeholder="Nominal"
            value={nominal}
            onChange={(e) => {
              if (e.target.value < 0) {
                setNominal(0);
                setSelectedKeluarga([]);
                return;
              }
              setNominal(e.target.value);
              setSelectedKeluarga([]);
            }}
            required
            floatingClassName="mb-3"
            floatingLabel="Nominal"
            step={10000}
          />

          <Select
            options={keluargaOptions}
            value={selectedKeluarga}
            isLoading={loadingHistory || loadingKeluarga}
            onChange={(selected) => {
              const maxSelection = nominal / 10000;
              if (selected.length > maxSelection) {
                Swal.fire({
                  title: "Warning!",
                  text: `Anda hanya bisa memilih maksimal ${Math.round(
                    maxSelection
                  )} keluarga, pastikan nominal sudah sesuai !`,
                  icon: "warning",
                });
                return;
              }
              setSelectedKeluarga(selected);
            }}
            placeholder="Pilih Keluarga Anggota"
            isMulti
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
            isDisabled={!keluargaOptions.length} // Disable if no options
          />

          <CFormInput
            type="text"
            id="subKeterangan"
            placeholder="Sub Keterangan (Optional)"
            value={subKeterangan}
            onChange={(e) => setSubKeterangan(e.target.value)}
            floatingClassName="mb-3"
            floatingLabel="Sub Keterangan (Optional)"
          />

          <CFormInput
            type="file"
            id="fileBukti"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            floatingClassName="mb-3"
            floatingLabel="File Bukti (Wajib)"
            ref={fileInputRef}
            required
          />

          <CRow className="gy-3 justify-content-center">
            <CCol xs="12" md="12" xl="6">
              <CButton
                type="submit"
                color="primary"
                className="w-100"
                disabled={keluargaOptions.length === 0}
              >
                Submit
              </CButton>
            </CCol>
          </CRow>
        </>
      )}
    </CForm>
  );
};

export default TransactionInForm;
