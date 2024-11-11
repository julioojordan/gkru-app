import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services"; // Pastikan services sudah diatur dengan benar
import { CCard, CCardBody, CCardHeader, CButton, CSpinner } from '@coreui/react';

const HistoryDetail = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [historyDetail, setHistoryDetail] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const result = await services.HistoryService.getDetailHistory(id); // Panggil service untuk mendapatkan detail
        setHistoryDetail(result);
      } catch (error) {
        console.error("Error fetching Detail History:", error);
        setError(true);
      }
      setLoading(false);
    };

    fetchDetailData();
  }, [id]); // Menjalankan useEffect setiap kali id berubah

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  if (loading) {
    return <CSpinner color="primary" />; // Menampilkan spinner saat loading
  }

  if (error) {
    return <p>Error fetching data. Please try again later.</p>; // Menampilkan pesan error
  }

  // Mengonversi bulan ke nama bulan dalam bahasa Indonesia
  const monthName = historyDetail ? monthNames[historyDetail.Bulan - 1] : ''; // -1 karena array dimulai dari 0

  return (
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
        <p><strong>Lingkungan:</strong> {historyDetail.Lingkungan.NamaLingkungan} ({historyDetail.Lingkungan.KodeLingkungan})</p>
        <p><strong>Wilayah:</strong> {historyDetail.Wilayah.NamaWilayah} ({historyDetail.Wilayah.KodeWilayah})</p>
        <p><strong>Pembayaran untuk:</strong> {monthName} {historyDetail.Tahun}</p> {/* Menambahkan informasi bulan dan tahun */}
        {/* Tambahkan informasi lain yang relevan dari historyDetail */}
      </CCardBody>
    </CCard>
  );
};

export default HistoryDetail;
