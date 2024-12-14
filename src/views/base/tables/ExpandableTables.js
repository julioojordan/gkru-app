import React, { useState } from 'react';
import { styled } from '@mui/system';
import DataTable from 'react-data-table-component';
import {
  CFormInput,
  CButton,
  CCol,
  CRow
} from '@coreui/react';
import { CCard, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const getCustomStyles = (theme) => ({
  headCells: {
    style: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      border: '1px solid #DAE2ED',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      textAlign: 'center',
      fontSize: '16px',  // ukuran font header
    },
  },
  rows: {
    style: {
      border: '1px solid #DAE2ED',
      backgroundColor: theme === 'dark' ? '#444' : '#f7f9fc',
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: '14px',  // ukuran font baris data
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#666' : '#e0e0e0', // hover warna yang tidak terlalu terang
        color: theme === 'dark' ? '#fff' : '#666',
      },
    },
    stripedStyle: {
      backgroundColor: theme === 'dark' ? '#555' : '#C0C0C0',
      color: theme === 'dark' ? '#fff' : '#000',
    },
  },
  cells: {
    style: {
      border: '1px solid #DAE2ED',
      color: theme === 'dark' ? '#fff' : '#000',
    },
  },
  pagination: {
    style: {
      backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9',
      color: theme === 'dark' ? '#fff' : '#000',
      borderTop: '1px solid #DAE2ED',
      minHeight: '56px',
    },
    pageButtonsStyle: {
      borderRadius: '50%',
      height: '40px',
      width: '40px',
      padding: '8px',
      margin: '0 4px',
      color: theme === 'dark' ? '#fff' : '#333',
      fill: theme === 'dark' ? '#fff' : '#333',
      backgroundColor: theme === 'dark' ? '#555' : '#e4e4e4',
      fontSize: '14px', // ukuran font pagination
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#777' : '#d4d4d4',
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: theme === 'dark' ? '#888' : '#ccc',
      },
    },
  },
});


const GeneralTables = ({ columns, rows, filterKeys, onRowClicked = () => {} }) => {
    
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');

  const handleAnggotaClick = (data) => {
    navigate(`/anggota/${data.anggota.Id}`, { state: { data } });
  };

  const handleAddKeluarga = () => {
    navigate('/keluarga/add');
  };

  const localTheme = useSelector((state) => state.theme.theme);
  const customStyles = getCustomStyles(localTheme);

  if (!filterKeys || filterKeys.length === 0) {
    return <p>Error: No filter keys provided. Please specify at least one key to filter the data.</p>;
  }

  let filteredRows = []
  if (rows.length > 0){
    filteredRows = rows.filter(item => {
      const anggotaMatch = item.Anggota && item.Anggota.some(anggota =>
        Object.values(anggota).some(value =>
          value?.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      );
    
      const keluargaMatch = filterKeys.some(key => {
        const keys = key.split('.');
        let value = item;
        keys.forEach(k => value = value?.[k]);
        return value?.toString().toLowerCase().includes(filterText.toLowerCase());
      });

      return anggotaMatch || keluargaMatch;
    });
  }

  return (
    <Root sx={{ maxWidth: '100%', width: '100%' }}>

      <CRow className="align-items-center mb-3">
        <CCol xs="8" sm="10" md="10" lg="10">
          <CFormInput
            placeholder="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              marginRight: '10px',
              borderRadius: '5px',
              borderColor: '#ced4da',
            }}
          />
        </CCol>
        <CCol xs="4" sm="2" md="2" lg="2" className="text-right">
          <CButton
            color="success"
            onClick={handleAddKeluarga} // Ganti dengan action sesuai kebutuhan
            style={{
              width: '100%',
              height: '100%',
              fontSize: '0.9rem',
              padding: '10px 0',
              backgroundColor: '#28a745',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '5px',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
          >
            Add Keluarga
          </CButton>
        </CCol>
      </CRow>

      <div style={{ overflowX: 'auto' }}>
        <DataTable
          columns={columns}
          data={filteredRows}
          customStyles={customStyles}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 25]}
          paginationComponentOptions={{
            rowsPerPageText: 'Rows per page:',
            rangeSeparatorText: 'of',
          }}
          expandableRows
          expandableRowsComponent={({ data }) => {
            const keluarga = {
              Id: data.Id,
              Nomor: data.Nomor,
              Alamat: data.Alamat,
              KepalaKeluarga: data.KepalaKeluarga,
              Lingkungan: data.Lingkungan,
              Wilayah: data.Wilayah
            };
            return (
            <CCard style={{ width: '100%', marginTop: '10px', padding: '10px' }}>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>Nama Anggota</CTableHeaderCell>
                    <CTableHeaderCell>Jenis Kelamin</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal Lahir</CTableHeaderCell>
                    <CTableHeaderCell>Keterangan</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.KepalaKeluarga && (
                    <CTableRow 
                      key={data.KepalaKeluarga.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAnggotaClick({
                        anggota: data.KepalaKeluarga,
                        keluarga,
                        isKepalaKeluarga: true,
                        isFromKeluargaDetail: false,
                      })}
                    >
                      <CTableDataCell>1</CTableDataCell>
                      <CTableDataCell>{data.KepalaKeluarga.NamaLengkap}</CTableDataCell>
                      <CTableDataCell>
                        {data.KepalaKeluarga.JenisKelamin === 'P' ? 'Perempuan' : data.KepalaKeluarga.JenisKelamin === 'L' ? 'Laki-Laki' : 'Tidak Diketahui'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(data.KepalaKeluarga.TanggalLahir).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{data.KepalaKeluarga.Keterangan}</CTableDataCell>
                      <CTableDataCell>{data.KepalaKeluarga.Status}</CTableDataCell>
                    </CTableRow>
                  )}
                  
                  {data.Anggota &&  Array.isArray(data.Anggota) && data.Anggota.length > 0 && (
                    data.Anggota.map((anggota, index) => {
                      const stateData = {
                        anggota,
                        keluarga,
                        isKepalaKeluarga: false,
                        isFromKeluargaDetail: false
                      }; 
                      return (
                        <CTableRow 
                            key={anggota.Id} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAnggotaClick(stateData)}
                        >
                          <CTableDataCell>{index + 2}</CTableDataCell>
                          <CTableDataCell>{anggota.NamaLengkap}</CTableDataCell>
                          <CTableDataCell>
                            {anggota.JenisKelamin === 'P' ? 'Perempuan' : anggota.JenisKelamin === 'L' ? 'Laki-Laki' : 'Tidak Diketahui'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(anggota.TanggalLahir).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </CTableDataCell>
                          <CTableDataCell>{anggota.Keterangan}</CTableDataCell>
                          <CTableDataCell>{anggota.Status}</CTableDataCell>
                        </CTableRow>
                      );
                    })
                  )}
                </CTableBody>
              </CTable>
            </CCard>
          )}}
          onRowClicked={onRowClicked}
          striped
          highlightOnHover={false}
          pointerOnHover={true}
        />
      </div>
    </Root>
  );
};

const Root = styled('div')`
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }
`;

export default GeneralTables;
