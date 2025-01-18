import React from "react";
import PropTypes from "prop-types";
import { CRow, CCol, CWidgetStatsF } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilMoney,
  cibDeezer,
  cilPeople,
} from "@coreui/icons";
import Shimmer from "react-js-loading-shimmer";
import helper from "../../helper";

const WidgetsBrand = (props) => {
  const {
    loading,
    totalIncome,
    totalIncomeError,
    totalOutcome,
    totalOutcomeError,
    totalAnggota,
    totalKeluarga,
    totalWilayah,
    totalLingkungan,
    totalAnggotaError,
    totalKeluargaError,
    totalWilayahError,
    totalLingkunganError,
  } = props;

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={4}>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilMoney} height={24} />}
            title="Total Pemasukan"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalIncomeError ? (
                "Failed to fetch"
              ) : (
                `${helper.FormatToRupiah.formatToRupiah(totalIncome)}`
              )
            }
          />
        </CRow>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilMoney} height={24} />}
            title="Total Pengeluaran"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalOutcomeError ? (
                "Failed to fetch"
              ) : (
                `${helper.FormatToRupiah.formatToRupiah(totalOutcome)}`
              )
            }
          />
        </CRow>
      </CCol>
      <CCol sm={6} xl={4} xxl={4}>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Total Keluarga"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalKeluargaError ? (
                "Failed to fetch"
              ) : (
                `${totalKeluarga}`
              )
            }
          />
        </CRow>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            icon={<CIcon icon={cilPeople} height={24} />}
            title="Total Anggota"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalAnggotaError ? (
                "Failed to fetch"
              ) : (
                `${totalAnggota}`
              )
            }
          />
        </CRow>
      </CCol>
      <CCol sm={6} xl={4} xxl={4}>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibDeezer} height={24} />}
            title="Total Lingkungan"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalLingkunganError ? (
                "Failed to fetch"
              ) : (
                `${totalLingkungan}`
              )
            }
          />
        </CRow>
        <CRow>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibDeezer} height={24} />}
            title="Total Wilayah"
            style={{ width: "96%", marginLeft: 10 }}
            value={
              loading ? (
                <Shimmer width={80} height={20} />
              ) : totalWilayahError ? (
                "Failed to fetch"
              ) : (
                `${totalWilayah}`
              )
            }
          />
        </CRow>
      </CCol>
    </CRow>
  );
};

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
  totalIncome: PropTypes.number,
  totalIncomeError: PropTypes.bool,
  totalOutcome: PropTypes.number,
  totalOutcomeError: PropTypes.bool,
  loading: PropTypes.bool,
  totalAnggota: PropTypes.number,
  totalAnggotaError: PropTypes.bool,
  totalKeluarga: PropTypes.number,
  totalKeluargaError: PropTypes.bool,
  totalWilayah: PropTypes.number,
  totalWilayahError: PropTypes.bool,
  totalLingkungan: PropTypes.number,
  totalLingkunganError: PropTypes.bool,
};

export default WidgetsBrand;
