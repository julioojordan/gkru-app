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

const AddTHForm = () => {
  const { handleLogout } = useAuth();
  const [nominal, setNominal] = useState("");
  const [idKeluarga, setIdKeluarga] = useState(null);
  const [keterangan, setKeterangan] = useState("");
  const [idWilayah, setIdWilayah] = useState("");
  const [idLingkungan, setIdLingkungan] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [namaLingkungan, setNamaLingkungan] = useState("");
  const [subKeterangan, setSubKeterangan] = useState("");
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [keluarga, setKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKeterangan, setLoadingKeterangan] = useState(true);
  const [bulanOptions, setBulanOptions] = useState([]);
  const [selectedBulan, setSelectedBulan] = useState([]);
  const [fileBukti, setFileBukti] = useState(null);
  const [error, setError] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 2MB
  const VALID_FORMATS = ["image/jpeg", "image/png", "image/webp"];
  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);
  // Define months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
      new Date(2024, i)
    ),
  }));

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

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingKeterangan(true);
      // TO DO add loading terpisah kah untuk ini atau set loading whole page aja ??
      if (keterangan === "IN" && idKeluarga && year) {
        try {
          const response =
            await services.HistoryService.getAllHistoryWithIdKeluarga(
              idKeluarga.value,
              year
            );
          if (response) {
            // handle misalkan keluaga sudah pernah bayar
            const existingMonths = response.map((item) => item.Bulan);
            const availableMonths = months.filter(
              (month) => !existingMonths.includes(month.value)
            );
            setBulanOptions(availableMonths);
          } else {
            setBulanOptions(months);
          }
        } catch (error) {
          setError(true);
          if (error.response && error.response.status === 401) {
            await handleLogout();
          }
        } finally {
          setLoadingKeterangan(false);
        }
      }
    };

    fetchHistory();
  }, [keterangan, idKeluarga, year]);

  if (error) return <p>Error fetching data.</p>;

  const handleKeluargaChange = (selectedOption) => {
    setIdKeluarga(selectedOption);
    const selectedKeluarga = keluarga.find(
      (option) => option.Id === selectedOption.value
    );
    if (selectedKeluarga) {
      setIdWilayah(selectedKeluarga.Wilayah.Id);
      setIdLingkungan(selectedKeluarga.Lingkungan.Id);
      setNamaWilayah(selectedKeluarga.Wilayah.NamaWilayah);
      setNamaLingkungan(selectedKeluarga.Lingkungan.NamaLingkungan);
    } else {
      setIdWilayah("");
      setIdLingkungan("");
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
      Keterangan: keterangan,
      CreatedBy: createdBy,
      IdWilayah: parseInt(idWilayah, 10),
      IdLingkungan: parseInt(idLingkungan, 10),
      SubKeterangan: subKeterangan,
      CreatedDate: createdDate,
      Tahun: year,
    };

    if (fileBukti) {
      data.FileBukti = fileBukti;
    }

    if (keterangan === "IN") {
      const totalBulan = selectedBulan.length;
      const nominalPerBulan = Math.floor(parseInt(nominal, 10) / totalBulan);

      if (totalBulan * 10000 < parseInt(nominal, 10)) {
        const deficiency = parseInt(nominal, 10) / 10000 - totalBulan;
        await Swal.fire({
          title: "Error!",
          text: `Jumlah bulan yang dipilih kurang ${deficiency} bulan`,
          icon: "error",
        });
        return; // Hentikan eksekusi lebih lanjut
      }
      const requests = selectedBulan.map((bulan) => ({
        ...data,
        Nominal: nominalPerBulan,
        IdKeluarga: parseInt(idKeluarga.value, 10),
        Bulan: bulan.value,
      }));

      try {
        const loadingAlert = Swal.fire({
          title: "Loading...",
          text: "Please wait...",
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });

        for (const request of requests) {
          await services.HistoryService.addHistory(request);
        }

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
    } else {
      // Handle OUT case
      try {
        const loadingAlert = Swal.fire({
          title: "Loading...",
          text: "Please wait...",
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
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
    }

    // Reset form after submission
    setNominal("");
    setIdKeluarga(null);
    setKeterangan("");
    setIdWilayah("");
    setIdLingkungan("");
    setNamaWilayah("");
    setNamaLingkungan("");
    setSubKeterangan("");
    setSelectedBulan([]);
    setFileBukti(null);
  };

  return (
    <CForm onSubmit={handleSubmit}>
      {loading ? (
        <div className="shimmer">Loading...</div>
      ) : (
        <>
          <CFormInput
            type="number"
            id="nominal"
            placeholder="Nominal"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            required
            floatingClassName="mb-3"
            floatingLabel="Nominal"
            step={10000}
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

          <CFormSelect
            id="keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            required
            floatingClassName="mb-3"
            floatingLabel="Keterangan"
          >
            <option value="">Select Keterangan</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </CFormSelect>

          {loadingKeterangan && keterangan === "IN" ? (
            <p>Loading...</p>
          ) : (
            keterangan === "IN" && (
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
                <Select
                  options={bulanOptions}
                  value={selectedBulan}
                  onChange={(selected) => {
                    const maxSelection = nominal / 10000;
                    if (selected.length > maxSelection) {
                      Swal.fire({
                        title: "Warning!",
                        text: `Anda hanya bisa memilih maksimal ${maxSelection} bulan.`,
                        icon: "warning",
                      });
                      return;
                    }
                    setSelectedBulan(selected);
                  }}
                  placeholder="Select Bulan"
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
                  isDisabled={!bulanOptions.length} // Disable if no options
                />
              </>
            )
          )}

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

export default AddTHForm;
