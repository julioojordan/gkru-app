import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../../services";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CImage,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCardSubtitle,
} from "@coreui/react";
import { useAuth } from "../../hooks/useAuth";

const PembayaranDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleLogout } = useAuth();
  const [historyDetail, setHistoryDetail] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const beUrl = "http://localhost:3001";

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const result = await services.HistoryService.getHistoryByGroup(id);
        console.log(result, null, 2);
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

  const handleRowClick = (row) => {
    navigate(`/history/${row.Id}`);
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>Detail Pembayaran</h5>
        </CCardHeader>
        <CCardBody>
          {/* Tabel untuk menampilkan data */}
          <CTable striped hover className="shadow-sm">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>No</CTableHeaderCell>
                <CTableHeaderCell>Id</CTableHeaderCell>
                <CTableHeaderCell>Nominal</CTableHeaderCell>
                <CTableHeaderCell>Lingkungan</CTableHeaderCell>
                <CTableHeaderCell>Wilayah</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {historyDetail.map((item, index) => (
                <CTableRow
                  key={item.Id}
                  onClick={() => handleRowClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.Id}</CTableDataCell>
                  <CTableDataCell>{item.Nominal}</CTableDataCell>
                  <CTableDataCell>
                    {item.Lingkungan.NamaLingkungan}
                  </CTableDataCell>
                  <CTableDataCell>{item.Wilayah.NamaWilayah}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CCardSubtitle
            className="mb-2 text-body-secondary"
            style={{ marginLeft: "3px" }}
          >
            Bukti Pembayaran
          </CCardSubtitle>

          {/* Menampilkan gambar jika format file adalah gambar */}
          {/\.(jpeg|jpg|png|gif)$/i.test(historyDetail[0]?.File) ? (
            <CRow>
              <CImage
                src={beUrl + historyDetail[0]?.File}
                alt="Bukti Pembayaran"
                fluid
                style={{ maxWidth: "100%", height: "auto" }}
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
              href={`${beUrl}${historyDetail[0]?.File}`}
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
    </>
  );
};

export default PembayaranDetail;
