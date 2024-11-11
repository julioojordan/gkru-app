import React from 'react'
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMoney, cibDeezer, cilPeople } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import Shimmer from 'react-js-loading-shimmer';
import helper from '../../helper';


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
    totalLingkunganError
  } = props
  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          {...(props.withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      backgroundColor: 'rgba(255,255,255,.1)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointHoverBackgroundColor: '#fff',
                      borderWidth: 2,
                      data: [65, 59, 84, 84, 51, 55, 40],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
          values={[
            { 
              title: 'Pemasukan', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalIncomeError ? 'Failed to fetch' : `${helper.FormatToRupiah.formatToRupiah(totalIncome)}` 
            },
            { 
              title: 'Pengeluaran', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalOutcomeError ? 'Failed to fetch' : `${helper.FormatToRupiah.formatToRupiah(totalOutcome)}`
            },
          ]}
          style={{
            '--cui-card-cap-bg': '#3b5998',
          }}
        />
      </CCol>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          {...(props.withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      backgroundColor: 'rgba(255,255,255,.1)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointHoverBackgroundColor: '#fff',
                      borderWidth: 2,
                      data: [1, 13, 9, 17, 34, 41, 38],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={<CIcon icon={cilPeople} height={52} className="my-4 text-white" />}
          values={[
            { 
              title: 'Keluarga', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalKeluargaError ? 'Failed to fetch' : `${totalKeluarga}` 
            },
            { 
              title: 'Anggota', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalAnggotaError ? 'Failed to fetch' : `${totalAnggota}` 
            },
          ]}
          style={{
            '--cui-card-cap-bg': '#00aced',
          }}
        />
      </CCol>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          {...(props.withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      backgroundColor: 'rgba(255,255,255,.1)',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointHoverBackgroundColor: '#fff',
                      borderWidth: 2,
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={<CIcon icon={cibDeezer} height={52} className="my-4 text-white" />}
          values={[
            { 
              title: 'Lingkungan', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalLingkunganError ? 'Failed to fetch' : `${totalLingkungan}` 
            },
            { 
              title: 'Wilayah', 
              value: loading ? 
                <Shimmer width={80} height={20} /> : 
                totalWilayahError ? 'Failed to fetch' : `${totalWilayah}`
            },
          ]}
          style={{
            '--cui-card-cap-bg': '#4875b4',
          }}
        />
      </CCol>
    </CRow>
  )
}

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
}

export default WidgetsBrand
