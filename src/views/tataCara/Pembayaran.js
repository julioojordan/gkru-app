import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CCollapse,
} from "@coreui/react";
import { useAuth } from "../../hooks/useAuth";
import services from "../../services";

const Pembayaran = () => {
  const [lingkungan, setLingkungan] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapse, setCollapse] = useState(false);
  const [nominal, setNominal] = useState(0);
  const [jumlahKK, setJumlahKK] = useState(0);
  const [selectedKodeLingkungan, setSelectedKodeLingkungan] = useState("");
  const { handleLogout } = useAuth();
  const nominalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.LingkunganService.getAllLingkungan();
        setLingkungan(result);
      } catch (error) {
        console.error("Error fetching lingkungan:", error);
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const extractKodeLingkungan = (value) => {
    const kode = value.match(/^L(\d+)/); // Ekstrak angka setelah "L"
    return kode ? parseInt(kode[1], 10) : null; // Kembalikan sebagai integer
  };

  const handleNominalCalculation = () => {
    if (selectedKodeLingkungan && jumlahKK > 0) {
      const kodeLingkungan = selectedKodeLingkungan;
      const kodeUnik = 7;
      const totalNominal = jumlahKK * 10000 + kodeLingkungan * 10 + kodeUnik;

      setNominal(totalNominal);
      setTimeout(() => {
        nominalRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      console.log("Pastikan kode lingkungan dan jumlah KK diisi dengan benar.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p>Error fetching data.</p>;

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol lg="8">
          <CCard>
            <CCardHeader className="text-center bg-primary text-white">
              <h4 className="mb-0">Tata Cara Transfer Pembayaran</h4>
            </CCardHeader>
            <CCardBody>
              <p>Transfer pembayaran dapat dilakukan ke rekening berikut:</p>
              <div className="mb-3">
                <p>
                  <strong>Bank:</strong> BCA
                  <br />
                  <strong>No. Rekening:</strong> 222 999 4888
                </p>
              </div>

              {/* Penjelasan Cara Membayar */}
              <div className="mb-2">
                <h6>
                  <strong>Cara Membayar:</strong>
                </h6>
                <ul>
                  <li>
                    Pilih lingkungan tempat Anda berada pada opsi{" "}
                    <strong>Kode Lingkungan</strong>.
                  </li>
                  <li>
                    Masukkan jumlah Kepala Keluarga (KK) yang akan dibayarkan.
                  </li>
                  <li>
                    Nominal pembayaran akan dihitung otomatis sesuai ketentuan
                    berikut:
                    <ul>
                      <li>
                        Tambahkan kode lingkungan sebagai dua digit terakhir
                        sebelum <strong>angka unik "7"</strong>.
                      </li>
                      <li>
                        Contoh:
                        <ul>
                          <li>
                            L3 dengan 10 KK: <strong>Rp 100.037</strong> (angka
                            3 di depan 7).
                          </li>
                          <li>
                            L42 dengan 10 KK: <strong>Rp 100.427</strong> (angka
                            42 di depan 7).
                          </li>
                          <li>
                            L10 dengan 10 KK: <strong>Rp 100.107</strong> (angka
                            10 di depan 7).
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Transfer ke rekening di atas dengan nominal yang telah
                    dihitung.
                  </li>
                </ul>
              </div>

              {/* Simulasi */}
              <h6 className="mb-2">
                <strong>Simulasi</strong>
              </h6>
              <CRow className="g-3">
                <CCol md="6">
                  <label htmlFor="kodeLingkungan" className="form-label">
                    Kode Lingkungan
                  </label>
                  <select
                    id="kodeLingkungan"
                    className="form-select"
                    onChange={(e) => {
                      const kodeLingkungan = extractKodeLingkungan(
                        e.target.value
                      );
                      setSelectedKodeLingkungan(kodeLingkungan); // Simpan kode lingkungan sebagai angka
                    }}
                  >
                    <option value="">Pilih Kode Lingkungan</option>
                    {lingkungan.map((item) => (
                      <option
                        key={item.KodeLingkungan}
                        value={item.KodeLingkungan}
                      >
                        {item.KodeLingkungan} - {item.NamaLingkungan}
                      </option>
                    ))}
                  </select>
                </CCol>
                <CCol md="6">
                  <label htmlFor="jumlahKK" className="form-label">
                    Jumlah KK
                  </label>
                  <input
                    type="number"
                    id="jumlahKK"
                    className="form-control"
                    onChange={(e) => setJumlahKK(e.target.value)}
                  />
                </CCol>
              </CRow>
              <div className="d-grid gap-2 mt-4">
                <CButton
                  color="primary"
                  onClick={handleNominalCalculation}
                  disabled={!selectedKodeLingkungan || !jumlahKK}
                >
                  Hitung Nominal
                </CButton>
              </div>
              {nominal > 0 && (
                <div className="mt-4 text-center" ref={nominalRef}>
                  <p className="fs-5">
                    Nominal yang harus dibayarkan:{" "}
                    <strong>Rp {nominal.toLocaleString()}</strong>
                  </p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-4">
        <CCol lg="8">
          <CCard>
            <CCardHeader className="bg-light d-flex align-items-center justify-content-between">
              <strong>Tabel Kode Lingkungan</strong>
              <CButton
                color="link"
                className="text-decoration-none"
                onClick={() => setCollapse(!collapse)}
                aria-expanded={collapse}
              >
                {collapse ? "Sembunyikan" : "Tampilkan"}
              </CButton>
            </CCardHeader>
            <CCollapse visible={collapse}>
              <CCardBody>
                <CTable bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Kode Lingkungan</CTableHeaderCell>
                      <CTableHeaderCell>Nama Lingkungan</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {lingkungan.map((item) => (
                      <CTableRow key={item.KodeLingkungan}>
                        <CTableDataCell>{item.KodeLingkungan}</CTableDataCell>
                        <CTableDataCell>{item.NamaLingkungan}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCollapse>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Pembayaran;
