import React, { useState } from "react";
import { styled } from "@mui/system";
import DataTable from "react-data-table-component";
import { CFormInput, CButton, CCol, CRow } from "@coreui/react";
import { useSelector } from "react-redux";

const getCustomStyles = (theme) => ({
  headCells: {
    style: {
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      border: "1px solid #DAE2ED",
      whiteSpace: "normal",
      wordBreak: "break-word",
      textAlign: "center",
      fontSize: "16px", // ukuran font header
    },
  },
  rows: {
    style: {
      border: "1px solid #DAE2ED",
      backgroundColor: theme === "dark" ? "#444" : "#f7f9fc",
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: "14px", // ukuran font baris data
      "&:hover": {
        backgroundColor: theme === "dark" ? "#666" : "#e0e0e0", // hover warna yang tidak terlalu terang
        color: theme === "dark" ? "#fff" : "#666",
      },
    },
    stripedStyle: {
      backgroundColor: theme === "dark" ? "#555" : "#C0C0C0",
      color: theme === "dark" ? "#fff" : "#000",
    },
  },
  cells: {
    style: {
      border: "1px solid #DAE2ED",
      color: theme === "dark" ? "#fff" : "#000",
    },
  },
  pagination: {
    style: {
      backgroundColor: theme === "dark" ? "#333" : "#f9f9f9",
      color: theme === "dark" ? "#fff" : "#000",
      borderTop: "1px solid #DAE2ED",
      minHeight: "56px",
    },
    pageButtonsStyle: {
      borderRadius: "50%",
      height: "40px",
      width: "40px",
      padding: "8px",
      margin: "0 4px",
      color: theme === "dark" ? "#fff" : "#333",
      fill: theme === "dark" ? "#fff" : "#333",
      backgroundColor: theme === "dark" ? "#555" : "#e4e4e4",
      fontSize: "14px", // ukuran font pagination
      "&:hover": {
        backgroundColor: theme === "dark" ? "#777" : "#d4d4d4",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: theme === "dark" ? "#888" : "#ccc",
      },
    },
  },
});

const GeneralTables = ({
  columns,
  rows,
  filterKeys,
  onRowClicked = () => {},
  navigateContext,
}) => {
  const [filterText, setFilterText] = useState("");
  const localTheme = useSelector((state) => state.theme.theme);
  const customStyles = getCustomStyles(localTheme);

  // Validasi jika filterKeys kosong
  if (!filterKeys || filterKeys.length === 0) {
    return (
      <p>
        Error: No filter keys provided. Please specify at least one key to
        filter the data.
      </p>
    );
  }

  let filteredRows = [];
  if (rows.length > 0) {
    filteredRows = rows.filter((item) =>
      filterKeys.some((key) => {
        // Memecah key yang berbentuk string seperti "Lingkungan.NamaLingkungan"
        const keys = key.split(".");
        let value = item;

        // Akses nilai berdasarkan key yang telah dipisah
        keys.forEach((k) => {
          if (value) {
            value = value[k];
          }
        });

        return value
          ?.toString()
          .toLowerCase()
          .includes(filterText.toLowerCase());
      })
    );
  }

  return (
    <Root sx={{ maxWidth: "100%", width: "100%" }}>
      <CRow className="align-items-center mb-3">
        <CCol
          xs={navigateContext && navigateContext.length != 0 ? 8 : 12}
          sm={navigateContext && navigateContext.length != 0 ? 8 : 12}
          md={navigateContext && navigateContext.length != 0 ? 8 : 12}
          lg={navigateContext && navigateContext.length != 0 ? 8 : 12}
        >
          <CFormInput
            placeholder="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              marginRight: "10px",
              borderRadius: "5px",
              borderColor: "#ced4da",
            }}
          />
        </CCol>
        {navigateContext &&
          navigateContext.length != 0 &&
          navigateContext.map((context, index) => (
            <CCol xs="4" sm="4" md="4" lg="4" className="text-right">
              <CButton
                id={`${context.name}-${index}`}
                color="success"
                onClick={navigateContext[index]}
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "0.9rem",
                  padding: "10px 0",
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#218838")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
              >
                {context.name.replace("_", " ")}
              </CButton>
            </CCol>
          ))}
      </CRow>

      <div style={{ overflowX: "auto" }}>
        <DataTable
          columns={columns}
          data={filteredRows}
          customStyles={customStyles}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 25]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          onRowClicked={onRowClicked}
          striped
          highlightOnHover={false}
          pointerOnHover={true}
        />
      </div>
    </Root>
  );
};

const Root = styled("div")`
  table {
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }
`;

export default GeneralTables;
