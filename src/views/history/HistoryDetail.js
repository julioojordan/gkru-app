import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CImage,
} from "@coreui/react";
import { useAuth } from "../../hooks/useAuth";
import helper from "../../helper";
import useHandleBack from "../../hooks/useHandleBack";

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [historyDetail, setHistoryDetail] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const beUrl = process.env.REACT_APP_SERVICE_URL || "http://localhost:3001"

  useHandleBack("/history");

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const result = await services.HistoryService.getDetailHistory(id);
        setHistoryDetail(result);
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      }
      setLoading(false);
    };

    fetchDetailData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error fetching data. Please try again later.</p>;
  }

  const monthName = historyDetail ? monthNames[historyDetail.Bulan - 1] : "";

  const navigateToDetail = () => {
    navigate(`/pembayaranDetail/${historyDetail.GroupId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>Detail Transaksi</h5>
        </CCardHeader>
        <CCardBody>
          <CRow clasName="gy-3">
            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>ID</strong>
                </CCol>
                <CCol xs="6">: {historyDetail.Id}</CCol>
              </CRow>
            </CCol>

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Keterangan</strong>
                </CCol>
                <CCol xs="6">: {historyDetail.Keterangan}</CCol>
              </CRow>
            </CCol>

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Sub Keterangan</strong>
                </CCol>
                <CCol xs="6">
                  :{" "}
                  {historyDetail.SubKeterangan
                    ? historyDetail.SubKeterangan
                    : "(Tidak ada Sub Keterangan)"}
                </CCol>
              </CRow>
            </CCol>

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Nominal</strong>
                </CCol>
                <CCol xs="6">
                  :{" "}
                  {helper.FormatToRupiah.formatToRupiah(historyDetail.Nominal)}
                </CCol>
              </CRow>
            </CCol>

            {historyDetail.Keterangan === "IN" && (
              <CCol xs="12" md="6">
                <CRow>
                  <CCol xs="6">
                    <strong>ID Keluarga</strong>
                  </CCol>
                  <CCol xs="6">: {historyDetail.IdKeluarga}</CCol>
                </CRow>
              </CCol>
            )}

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Lingkungan</strong>
                </CCol>
                <CCol xs="6">
                  : {historyDetail.Lingkungan.NamaLingkungan} (
                  {historyDetail.Lingkungan.KodeLingkungan})
                </CCol>
              </CRow>
            </CCol>

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Wilayah</strong>
                </CCol>
                <CCol xs="6">
                  : {historyDetail.Wilayah.NamaWilayah} (
                  {historyDetail.Wilayah.KodeWilayah})
                </CCol>
              </CRow>
            </CCol>

            <CCol xs="12" md="6">
              <CRow>
                <CCol xs="6">
                  <strong>Pembayaran untuk</strong>
                </CCol>
                <CCol xs="6">
                  : {monthName} {historyDetail.Tahun}
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <br></br>
          <CRow className="gy-3 justify-content-center">
            <CCol xs="12" md="6">
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
            {historyDetail.GroupId !== 0 &&
              historyDetail.Keterangan === "IN" && (
                <CCol xs="12" md="6">
                  <CButton
                    color="info"
                    onClick={navigateToDetail}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Lihat Bukti
                  </CButton>
                </CCol>
              )}
          </CRow>
        </CCardBody>
      </CCard>
      {historyDetail.GroupId !== 0 &&
        historyDetail.Keterangan == "OUT" && (
          <CCard className="mt-4">
            <CCardHeader>
              <h5>Bukti Pembayaran</h5>
            </CCardHeader>
            <CCardBody>
              {/* Menampilkan gambar jika format file adalah gambar */}
              {/\.(jpeg|jpg|png|gif)$/i.test(historyDetail.File) ? (
                <CRow>
                  <CImage
                    src={beUrl + historyDetail.File}
                    alt="Bukti Pembayaran"
                    fluid
                    style={{ maxWidth: "100%", height: "auto" }} // Menjaga proporsi gambar
                  />
                </CRow>
              ) : (
                <p>
                  Tidak dapat menampilkan file. Anda dapat mengunduhnya melalui
                  tautan di bawah.
                </p>
              )}

              {/* Tautan untuk mengunduh file bukti */}
              <CRow className="gy-3 justify-content-center">
                <a
                  href={`${beUrl}${historyDetail.File}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CButton color="primary" className="mt-3">
                    Unduh Bukti Pembayaran
                  </CButton>
                </a>
              </CRow>
            </CCardBody>
          </CCard>
        )}
    </>
  );
};

export default HistoryDetail;
