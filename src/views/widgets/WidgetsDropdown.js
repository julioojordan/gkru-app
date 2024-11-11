import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { CRow, CCol, CWidgetStatsA } from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartLine } from "@coreui/react-chartjs";
// import Shimmer from "react-shimmer-effect";
import Shimmer from 'react-js-loading-shimmer';
import helper from '../../helper';

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const loading = props.loading;
  const totalWealth = props.totalWealth;
  const error = props.error;

  useEffect(() => {
    document.documentElement.addEventListener("ColorSchemeChange", () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor =
            getStyle("--cui-primary");
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor =
            getStyle("--cui-info");
          widgetChartRef2.current.update();
        });
      }
    });
  }, [widgetChartRef1, widgetChartRef2]);

  return (
    <>

      <CRow className={props.className} xs={{ gutter: 4 }}>
        <CCol sm={12} xl={12} xxl={12}>
          <CWidgetStatsA
            color="info"
            value={
              loading ? (
                <Shimmer width={100} height={20} /> // Tampilkan shimmer saat loading
              ) : error ? (
                <div>Failed to fetch total wealth</div> // Tampilkan error jika request wealth gagal
              ) : (
                <div>{helper.FormatToRupiah.formatToRupiah(totalWealth)}</div> // Tampilkan data jika tidak ada error
              )
            }
            title="Total Kas"
            chart={
              <CChartLine
                ref={widgetChartRef2}
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: getStyle("--cui-info"),
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>
    </>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
  totalWealth: PropTypes.number,
  totalWealthError: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

export default WidgetsDropdown;
