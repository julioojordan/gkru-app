import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services"; // Pastikan services sudah diatur dengan benar
import { CCard, CCardBody, CCardHeader, CButton, CSpinner, CImage, CRow } from '@coreui/react';
import { useAuth } from '../../hooks/useAuth';

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [historyDetail, setHistoryDetail] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const beUrl = "http://localhost:3001";

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
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  if (loading) {
    return <CSpinner color="primary" />;
  }

  if (error) {
    return <p>Error fetching data. Please try again later.</p>;
  }

  const monthName = historyDetail ? monthNames[historyDetail.Bulan - 1] : '';

  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>Detail Transaksi</h5>
          <CButton color="secondary" onClick={() => navigate(-1)}>Back</CButton>
        </CCardHeader>
        <CCardBody>
          <h6>ID: {historyDetail.Id}</h6>
          <p><strong>In Out:</strong> {historyDetail.Keterangan}</p>
          <p><strong>Sub Keterangan:</strong> {historyDetail.SubKeterangan}</p>
          <p><strong>Nominal:</strong> {historyDetail.Nominal}</p>
          {historyDetail.Keterangan == "IN" && (
            <p><strong>ID Keluarga:</strong> {historyDetail.IdKeluarga}</p>
          )}
          <p><strong>Lingkungan:</strong> {historyDetail.Lingkungan.NamaLingkungan} ({historyDetail.Lingkungan.KodeLingkungan})</p>
          <p><strong>Wilayah:</strong> {historyDetail.Wilayah.NamaWilayah} ({historyDetail.Wilayah.KodeWilayah})</p>
          <p><strong>Pembayaran untuk:</strong> {monthName} {historyDetail.Tahun}</p>
          
        </CCardBody>
      </CCard>

      {/* Card untuk menampilkan Bukti Pembayaran */}
      {historyDetail.FileBukti && (
        <CCard className="mt-4">
          <CCardHeader>
            <h5>Bukti Pembayaran</h5>
          </CCardHeader>
          <CCardBody>
            {/* Menampilkan gambar jika format file adalah gambar */}
            {/\.(jpeg|jpg|png|gif)$/i.test(historyDetail.FileBukti) ? (
              <CRow>
                <CImage
                  src={beUrl + historyDetail.FileBukti}
                  alt="Bukti Pembayaran"
                  fluid
                  style={{ maxWidth: "100%", height: "auto" }} // Menjaga proporsi gambar
                />
              </CRow>
            ) : (
              <p>Tidak dapat menampilkan file. Anda dapat mengunduhnya melalui tautan di bawah.</p>
            )}
        
            {/* Tautan untuk mengunduh file bukti */}
            <CRow>
              <a href={historyDetail.FileBukti} target="_blank" rel="noopener noreferrer">
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
