import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { multiSelectStyles } from "../base/select/selectStyle";

const TransactionInForm = () => {
  const { handleLogout } = useAuth();
  const fileInputRef = useRef(null);
  const { ketuaLingkungan, ketuaWilayah } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.role);
  const localTheme = useSelector((state) => state.theme.theme);

  // form state
  const [nominal, setNominal] = useState("");
  const [idLingkungan, setIdLingkungan] = useState("");
  const [kodeLingkungan, setKodeLingkungan] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [subKeterangan, setSubKeterangan] = useState("");
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedKeluarga, setSelectedKeluarga] = useState([]);
  const [fileBukti, setFileBukti] = useState(null);
  const [error, setError] = useState(false);

  // loading flags
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingKeluarga, setLoadingKeluarga] = useState(false);

  // date selections
  const CURRENT_YEAR = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
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
  const [lingkungan, setLingkungan] = useState([]);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);

  // multi-select state
  const yearOptions = useMemo(
    () => [
      { value: CURRENT_YEAR - 2, label: `${CURRENT_YEAR - 2}` },
      { value: CURRENT_YEAR - 1, label: `${CURRENT_YEAR - 1}` },
      { value: CURRENT_YEAR, label: `${CURRENT_YEAR}` },
      { value: CURRENT_YEAR + 1, label: `${CURRENT_YEAR + 1}` },
      { value: CURRENT_YEAR + 2, label: `${CURRENT_YEAR + 2}` },
    ],
    [CURRENT_YEAR]
  );
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonthYears, setSelectedMonthYears] = useState([]);

  // build month-year options based on selectedYears
  const monthYearOptions = useMemo(() => {
    return selectedYears.flatMap(({ value: y }) =>
      months.map((m) => ({
        value: `${y}-${m}`,
        label: `${monthNames[m - 1]} ${y}`,
      }))
    );
  }, [selectedYears]);

  //select all anggota
  const selectAllOption = { value: "*", label: "Pilih Semua" };

  // Fetch lingkungan options on mount
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

  // Fetch history for all selected month-years
  useEffect(() => {
    const fetchHistoryMulti = async () => {
      if (!idLingkungan || selectedMonthYears.length === 0) {
        setHistory([]);
        return;
      }
      setLoadingHistory(true);
      try {
        const results = await Promise.all(
          selectedMonthYears.map(({ value }) => {
            const [y, m] = value.split("-").map(Number);
            return services.HistoryService.getAllHistoryWithTimeFilter(
              ketuaLingkungan,
              ketuaWilayah,
              m,
              y
            );
          })
        );
        setHistory(results.flat());
      } catch (err) {
        setError(true);
        if (err.response?.status === 401) await handleLogout();
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistoryMulti();
  }, [selectedMonthYears, idLingkungan]);

  // Fetch keluarga options based on combined history
  useEffect(() => {
    const fetchKeluarga = async () => {
      setLoadingKeluarga(true);
      try {
        const allKeluarga = await services.KeluargaService.getAllKeluarga(
          ketuaLingkungan,
          ketuaWilayah
        );
        // records yang sudah bayar per tahun-bulan
        const paidRecords = history
          .filter((h) => h.Keterangan === "IN")
          .map((h) => ({ id: h.IdKeluarga, tahun: h.Tahun, bulan: h.Bulan }));
        // bangun opsi untuk tiap keluarga & tiap bulan-tahun yang belum bayar
        const opts = [];
        selectedMonthYears.forEach(({ value }) => {
          const [y, m] = value.split("-").map(Number);
          allKeluarga.forEach((k) => {
            if (
              k.Lingkungan.Id === idLingkungan &&
              k.Status === "aktif" &&
              !paidRecords.some(
                (pr) => pr.id === k.Id && pr.tahun === y && pr.bulan === m
              )
            ) {
              opts.push({
                value: `${k.Id}-${y}-${m}`,
                label: `Keluarga ${k.KepalaKeluarga.NamaLengkap} - ${
                  monthNames[m - 1]
                } ${y}`,
              });
            }
          });
        });
        setKeluargaOptions(opts);
      } catch (err) {
        setError(true);
        if (err.response?.status === 401) await handleLogout();
      } finally {
        setLoadingKeluarga(false);
      }
    };
    fetchKeluarga();
  }, [history, idLingkungan]);

  const handleLingkunganChange = (selectedOption) => {
    const selectedLingkungan = lingkungan.find(
      (lingkungan) => lingkungan.Id === selectedOption.value
    );
    setIdLingkungan(selectedLingkungan.Id);
    setKodeLingkungan(selectedLingkungan.KodeLingkungan);
    setNamaWilayah(selectedLingkungan.Wilayah.NamaWilayah);
  };

  // handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        Swal.fire({
          title: "Error!",
          text: "Ukuran file > 2MB",
          icon: "error",
        });
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        Swal.fire({
          title: "Error!",
          text: "Format file tidak sesuai.",
          icon: "error",
        });
        return;
      }
      setFileBukti(file);
    }
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdBy = 1;
    const createdDate = new Date().toISOString();
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

    const nominalEntry = Math.floor(parseInt(nominal, 10) / totalKeluarga);

    // build requests per selection
    const requests = selectedKeluarga.map((sel) => {
      const [fid, y, m] = sel.value.split("-").map(Number);
      return {
        Nominal: nominalEntry,
        Keterangan: "IN",
        CreatedBy: createdBy,
        SubKeterangan: subKeterangan,
        CreatedDate: createdDate,
        Tahun: y,
        Bulan: m,
        IdKeluarga: fid,
      };
    });

    try {
      const loadingAlert = Swal.fire({
        title: "Loading...",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
        },
      });
      await services.HistoryService.addHistoryIuran(
        requests,
        fileBukti,
        kodeLingkungan
      );
      await Swal.fire({
        title: "Success!",
        text: "Data berhasil ditambahkan.",
        icon: "success",
      });
    } catch (err) {
      if (err.response?.status === 401) await handleLogout();
      else
        await Swal.fire({
          title: "Error!",
          text: "Gagal menambahkan data.",
          icon: "error",
        });
    } finally {
      Swal.close();
      // reset form
      setNominal("");
      setIdLingkungan("");
      setNamaWilayah("");
      setSubKeterangan("");
      setSelectedYears([]);
      setSelectedMonthYears([]);
      setSelectedKeluarga([]);
      setFileBukti(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      window.location.reload();
    }
  };

  if (error) return <p>Error fetching data.</p>;

  return (
    <CForm onSubmit={handleSubmit}>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <>
          <Select
            id="tahun"
            options={yearOptions}
            value={selectedYears}
            onChange={setSelectedYears}
            isMulti
            placeholder="Pilih Tahun..."
            className="mb-3"
            required
            styles={multiSelectStyles(localTheme)}
          />

          <Select
            options={monthYearOptions}
            value={selectedMonthYears}
            onChange={setSelectedMonthYears}
            isMulti
            isSearchable
            placeholder="Pilih Bulan-Tahun..."
            isDisabled={!selectedYears.length}
            className="mb-3"
            styles={multiSelectStyles(localTheme)}
          />
          <Select
            options={lingkunganOptions}
            onChange={handleLingkunganChange}
            value={lingkunganOptions.find(
              (option) => option.value === idLingkungan
            )}
            placeholder="Pilih Lingkungan"
            isDisabled={role === "ketuaLingkungan"}
            styles={multiSelectStyles(localTheme)}
          />

          {keluargaOptions.length === 0 && idLingkungan && (
            <CAlert color="success">
              Semua Keluarga Anggota telah membayar iuran pada bulan dan tahun
              yang dipilih
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
            type="text"
            id="nominal"
            placeholder="Nominal"
            value={helper.FormatToRupiah.formatToRupiah(nominal)}
            onChange={(e) => {
              const rawValue = helper.parseRupiah.parseRupiah(e.target.value);
              if (rawValue < 0) {
                setNominal(0);
                setSelectedKeluarga([]);
                return;
              }

              if (rawValue >= keluargaOptions.length * 10000) {
                setKeluargaOptions([selectAllOption, ...keluargaOptions]);
              }

              setNominal(rawValue);
              setSelectedKeluarga([]);
            }}
            required
            floatingClassName="mb-3"
            floatingLabel="Nominal"
          />

          <Select
            options={keluargaOptions}
            value={selectedKeluarga}
            isLoading={loadingHistory || loadingKeluarga}
            onChange={(selected) => {
              const maxSelection = nominal / 10000;
              if (!selected || selected.length === 0) {
                setSelectedKeluarga([]);

                // Kalau nominal masih pas → pastikan Select All tetap ada
                if (nominal >= keluargaOptions.length * 10000) {
                  setKeluargaOptions((prev) => {
                    const hasSelectAll = prev.some((opt) => opt.value === "*");
                    return hasSelectAll ? prev : [selectAllOption, ...prev];
                  });
                }
                return;
              }
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
              if (selected.some((option) => option.value === "*")) {
                // pilih semua yang asli (tanpa opsi "*")
                setSelectedKeluarga(
                  keluargaOptions.filter((opt) => opt.value !== "*")
                );
                // Hapus '*' dari list keluargaOptions
                setKeluargaOptions((prev) =>
                  prev.filter((opt) => opt.value !== "*")
                );
                return;
              }

              setSelectedKeluarga(selected);
            }}
            placeholder="Pilih Keluarga Anggota"
            isMulti
            isSearchable
            styles={multiSelectStyles(localTheme)}
            required
            isDisabled={!keluargaOptions.length}
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
            <CCol xs="12" md="6">
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

export default TransactionInForm;
