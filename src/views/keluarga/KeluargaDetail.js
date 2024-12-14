import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect } from '@coreui/react';
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import Select from 'react-select';
import services from '../../services';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import useHandleBack from '../../hooks/useHandleBack';
import { useSelector } from "react-redux";

const KeluargaDetail = () => {
  const { handleLogout } = useAuth();
  const role = useSelector((state) => state.role);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    IdKeluarga: '',
    oldKepalaKeluarga: '',
    NamaKepalaKeluarga: '',
    KepalaKeluarga: '',
    Lingkungan: '',
    NamaLingkungan: '',
    Wilayah: '',
    NamaWilayah: '',
    Alamat: '',
    TanggalLahir: '',
    TanggalBaptis: '',
    Nomor: '',
    Status: ''
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [data, setData] = useState(location.state?.data || null);
  const [payedMonths, setPayedMonths] = useState([]);
  const [anggotaOptions, setAnggotaOptions] = useState([]);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anggota, setAnggota] = useState([]);
  const [anggotaTable, setAnggotaTable] = useState(location.state?.data ? location.state.data.Anggota : null);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const [lingkungan, setLingkungan] = useState([]);
  const [error, setError] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Tahun 2024 - 2028
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const getFormValue = (data) => {
    const formValue = {
        IdKeluarga: data.Id,
        NamaKepalaKeluarga: data.KepalaKeluarga.NamaLengkap,
        oldKepalaKeluarga: data.KepalaKeluarga.Id,
        KepalaKeluarga: data.KepalaKeluarga.Id,
        Wilayah: data.Lingkungan.Wilayah.Id,
        NamaWilayah: data.Lingkungan.Wilayah.NamaWilayah,
        Lingkungan: data.Lingkungan.Id,
        NamaLingkungan: data.Lingkungan.NamaLingkungan,
        Alamat: data.Alamat,
        Nomor: data.Nomor,
        Status: data.Status,
        TanggalLahir: data.KepalaKeluarga.TanggalLahir.slice(0, 10),
        TanggalBaptis: data.KepalaKeluarga.TanggalBaptis.slice(0, 10),
    }
    return formValue
  }

  const setLocalState = async () => {
    setLoading(true);
    try{     
      const dataKeluarga = await services.KeluargaService.getKeluargaById(id);                                                                                                                                                                                                                                                                                                                                 
      setData(dataKeluarga);
      setAnggotaTable(dataKeluarga.Anggota);
      if (role.role === "ketuaLingkungan" && auth.ketuaLingkungan !== dataKeluarga.Lingkungan.Id){
        navigate(-1);
      }
      if (role.role === "ketuaWilayah" && auth.ketuaWilayah !== dataKeluarga.Wilayah.Id){
        navigate(-1);
      }   

      return dataKeluarga
    }catch(error){
      setError(true);
      if (error.response && error.response.status === 401) {
        await handleLogout();
        return;
      }
      if (error.response && error.response.status === 404) {
        navigate('/notFound')
      }
    }finally{
      setLoading(false);
    }
  }

  useHandleBack("/keluarga");

  useEffect(() => {
    const fetchData = async () => {
      if (!data) {
        const dataKeluarga = await setLocalState();
        console.log({dataKeluarga})
        if(dataKeluarga){
          setFormData(getFormValue(dataKeluarga));
          setInitialFormData(getFormValue(dataKeluarga));
        }
        return;
      }else {
        setFormData(getFormValue(data));
        setInitialFormData(getFormValue(data));
        setAnggotaTable(data.Anggota);
      }
    }

    fetchData();
  }, [data]);

  useEffect(() => {
    const fetchHistory = async () => {
      let idKeluarga;
      if (!data) {
        const dataKeluarga = await setLocalState();
        if(dataKeluarga){
          idKeluarga = dataKeluarga.Id;
        }
      }else{
        idKeluarga = data.Id
      }
      setLoading(true);
      try {
          const response = await services.HistoryService.getAllHistoryWithIdKeluarga(idKeluarga);
          if (response){
            const payedData = response
            .filter(item => item.Keterangan === 'IN')
            .map(item => ({
                month: item.Bulan,
                id: item.Id,
                year: item.Tahun,
            }));
            setPayedMonths(payedData)
          }else{
            setPayedMonths([])
          }
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [data]);

  useEffect(() => {
    const fetchEditData= async () => {
      let idKeluarga;
      if (!data) {
        const dataKeluarga = await setLocalState();
        if(dataKeluarga){
          idKeluarga = dataKeluarga.Id;
        }
      }else{
        idKeluarga = data.Id
      }
      setLoadingEdit(true);
      try {
        const anggotaResponse = await services.AnggotaService.getAllAnggotaWithIdKeluarga(idKeluarga);
        const lingkunganResponse = await services.LingkunganService.getAllLingkungan();
        const options = anggotaResponse
        .filter(anggota => anggota.Status === "HIDUP")
        .map(anggota => ({
          value: anggota.Id,
          label: anggota.NamaLengkap,
        }));

        const options2 = lingkunganResponse.map(lingkungan => ({
          value: lingkungan.Id,
          label: `${lingkungan.KodeLingkungan} - ${lingkungan.NamaLingkungan}`,
        }));
        setAnggota(anggotaResponse);
        setAnggotaOptions(options);
        setLingkungan(lingkunganResponse);
        setLingkunganOptions(options2);
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      }finally {
        setLoadingEdit(false);
      }
    };

    if (isEditable) {
        fetchEditData();
    }
  }, [data, isEditable]);
  
  if (error) return <p>Error fetching data.</p>;

  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleCancelEdit = () => {
    setFormData(initialFormData)
    setIsEditable(false);
  };

  const handleHistoryClick = (id) => {
    navigate(`/history/${id}`);
  };

  const handleTambahAnggotaClick = () => {
    navigate('/anggota/add', { state: { data } })
  }
  
  const handleAnggotaClick = (data) => {
    navigate(`/anggota/${data.anggota.Id}`, { state: { data } });
  };

  const handleKepalaChange = (selectedOption) => {
    const selectedAnggota = anggota.find(anggota => anggota.Id === selectedOption.value);
    setFormData({
      ...formData,
      NamaKepalaKeluarga: selectedAnggota.NamaLengkap,
      KepalaKeluarga: selectedAnggota.Id,
      TanggalLahir: selectedAnggota.TanggalLahir.slice(0, 10),
      TanggalBaptis: selectedAnggota.TanggalBaptis.slice(0, 10)
    });
  };

  const handleLingkunganChange = (selectedOption) => {
    const selectedLingkungan = lingkungan.find(lingkungan => lingkungan.Id === selectedOption.value);
    setFormData({
      ...formData,
      Lingkungan: selectedLingkungan.Id,
      NamaLingkungan: selectedLingkungan.NamaLingkungan,
      Wilayah: selectedLingkungan.Wilayah.Id,
      NamaWilayah: selectedLingkungan.Wilayah.NamaWilayah,
    });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await services.KeluargaService.updateKeluarga(formData)
      // set new local State
      const newSelectedLingkungan = lingkungan.find(lingkungan => lingkungan.Id === response.IdLingkungan);
      const newData = {
        ...response,
        Lingkungan: newSelectedLingkungan,
        Wilayah: newSelectedLingkungan.Wilayah
      };
      
      setAnggotaTable(response.Anggota);
      console.log({newData})
      await Swal.fire({
        title: 'Success!',
        text: 'Data has been updated successfully.',
        icon: 'success',
      }).then(() => {
        navigate(`/keluarga/${data.Id}`, { state: { data: newData } })
      });

    } catch (error) {
      setFormData(initialFormData);
      setTimeout(() => {
        handleKepalaChange(anggotaOptions.find(option => option.value === initialFormData.KepalaKeluarga));
        handleLingkunganChange(lingkunganOptions.find(option => option.value === initialFormData.Lingkungan));
      }, 0);

      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error updating the data.",
          icon: "error",
        }).then(() => {
           // biar aman kalo error dikembalikan ke halaman keluarga saja -> case tx update sudah di commit errornya waktu fetching data anggota di backend
           // kalo gak dibalikin ke keluarga agak tricky di local state nya halaman ini
           // kalo dibalikin pun tidak masalah karena tidak ada update data hanya error fetching saja
          navigate(`/keluarga`)
        });
      }
    } finally {
      Swal.close();
      setIsEditable(false);
    }
  };

  return (
    <CCard className="shadow-lg rounded">
      <CCardBody>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold'}}>Keluarga Anggota Detail</h1> 
        {!isEditable && (
          <h3 style={{ textAlign: 'center', fontSize: '1.25rem', color: '#6c757d' }}>
            {formData.Nomor}
            <span 
              className={`badge ${formData.Status === "aktif" ? "text-bg-success" : "text-bg-danger"}`}
              style={{marginLeft: '10px', height: '25px'}}
            >
              {formData.Status}
            </span>
         </h3>
        )}
        
        {loadingEdit ? (
          <div className="shimmer">Loading...</div>
        ) : (
          <CForm onSubmit={handleSubmit} className="p-3">
            {isEditable && (
              <>
                <CFormInput
                  type="text"
                  name="Nomor"
                  label="Nomor Keluarga"
                  value={formData.Nomor}
                  onChange={handleChange}
                  className="mb-3 shadow-sm"
                />
                <CFormSelect
                  id="status"
                  value={formData.Status}
                  onChange={handleChange}
                  required
                  floatingClassName="mb-3"
                  floatingLabel="Status"
                  name="Status"
                >
                  <option value="">Select Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonAktif">Tidak Aktif</option>
                </CFormSelect>
              </>

            )}
            
            <CRow className="mt-4">
              <CCol lg={6} sm={12}>
                {isEditable ? (
                  <Select
                    options={anggotaOptions}
                    onChange={handleKepalaChange}
                    value={anggotaOptions.find(option => option.value === formData.KepalaKeluarga)}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: '100%',
                        marginBottom: '1rem',
                      }),
                      control: (base) => ({
                        ...base,
                        // backgroundColor: '#f8f9fa',
                        borderColor: '#ced4da',
                        borderRadius: '0.375rem',
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050,
                      }),
                    }}
                  />
                ) : (
                  <CFormInput
                    type="text"
                    name="NamaKepalaKeluarga"
                    floatingLabel="Nama Kepala Keluarga"
                    value={formData.NamaKepalaKeluarga}
                    disabled
                    className="mb-3 bg-light"
                  />
                )}
                {/* Tanggal Lahir dan Baptis */}
                <CFormInput
                  type="date"
                  name="TanggalLahir"
                  floatingLabel="Tanggal Lahir"
                  value={formData.TanggalLahir}
                  disabled={!isEditable}
                  className="mb-3 border-0 bg-light shadow-sm"
                />
                <CFormInput
                  type="date"
                  name="TanggalBaptis"
                  floatingLabel="Tanggal Baptis"
                  value={formData.TanggalBaptis}
                  disabled={!isEditable}
                  className="mb-3 border-0 bg-light shadow-sm"
                />
              </CCol>
              
              <CCol lg={6} sm={12}>
                <CFormInput
                  type="text"
                  name="Alamat"
                  floatingLabel="Alamat"
                  value={formData.Alamat}
                  onChange={handleChange}
                  className={`mb-3 shadow-sm ${isEditable ? 'border-info bg-white' : 'border-0 bg-light'}`}
                  disabled={!isEditable}
                />
                
                {isEditable ? (
                  <Select
                    options={lingkunganOptions}
                    onChange={handleLingkunganChange}
                    value={lingkunganOptions.find(option => option.value === formData.Lingkungan)}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: '100%',
                        marginBottom: '1rem',
                      }),
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#f8f9fa',
                        borderColor: '#ced4da',
                        borderRadius: '0.375rem',
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050,
                      }),
                    }}
                  />
                ) : (
                  <CFormInput
                    type="text"
                    name="Lingkungan"
                    floatingLabel="Lingkungan"
                    value={formData.NamaLingkungan}
                    disabled
                    className="mb-3 bg-light"
                  />
                )}
                <CFormInput
                  type="text"
                  name="Wilayah"
                  floatingLabel="Wilayah"
                  value={formData.NamaWilayah}
                  disabled
                  className="mb-3 bg-light"
                />
              </CCol>
            </CRow>
  
            <div className="d-flex justify-content-center mt-4">
              {!isEditable && (
                <CButton 
                color="info" 
                onClick={handleEdit} 
                className="me-2 shadow-sm" 
                disabled={isEditable}
                style={{
                  width: '200px',
                  height: '100%',
                  fontSize: '0.9rem',
                  padding: '10px 0',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                  transition: '0.3s',
                }}
                >
                  Edit
                </CButton>
              )
              
              }
              {isEditable && (
                <>
                  <CButton 
                  color="danger" 
                  onClick={handleCancelEdit} 
                  className="shadow-sm"
                  style={{
                    width: '200px',
                    height: '100%',
                    fontSize: '0.9rem',
                    padding: '10px 0',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    transition: '0.3s',
                  }}
                  >
                    Cancel
                  </CButton>
                  <p style={{margin: '10px'}}></p>
                  <CButton 
                  color="primary" 
                  type="submit" 
                  className="shadow-sm"
                  style={{
                    width: '200px',
                    height: '100%',
                    fontSize: '0.9rem',
                    padding: '10px 0',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    transition: '0.3s',
                  }}
                  >
                    Submit
                  </CButton>
                </>
              )}
            </div>
          </CForm>
        )}
  
        <hr className="my-4" />
  
        {/* Anggota Keluarga */}
        <h3 style={{ textAlign: 'center'}}>Anggota Keluarga</h3>
        <div style={{ overflowX: 'auto' }}>
          <CTable striped hover className="mt-4 shadow-sm">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>No</CTableHeaderCell>
                <CTableHeaderCell>Nama Anggota</CTableHeaderCell>
                <CTableHeaderCell>Tanggal Lahir</CTableHeaderCell>
                <CTableHeaderCell>Tanggal Baptis</CTableHeaderCell>
                <CTableHeaderCell>Keterangan</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Jenis Kelamin</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {anggotaTable && Array.isArray(anggotaTable) && anggotaTable.length > 0 ? (
                anggotaTable.map((anggota, index) => { 
                  const keluarga = data;
                  const stateData = {
                    anggota,
                    keluarga,
                    isKepalaKeluarga: false,
                    isFromKeluargaDetail: true
                  }; 
                  return (
                    <CTableRow 
                      key={anggota.Id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAnggotaClick(stateData)}
                    >
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{anggota.NamaLengkap}</CTableDataCell>
                      <CTableDataCell>{anggota.TanggalLahir.slice(0, 10)}</CTableDataCell>
                      <CTableDataCell>{anggota.TanggalBaptis.slice(0, 10)}</CTableDataCell>
                      <CTableDataCell>{anggota.Keterangan}</CTableDataCell>
                      <CTableDataCell>{anggota.Status}</CTableDataCell>
                      <CTableDataCell>
                        {anggota.JenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" style={{ textAlign: 'center' }}>
                    Tidak ada data anggota
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>

          </CTable>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <CButton
            color="success"
            onClick={handleTambahAnggotaClick}
            style={{
              width: '200px',
              height: '100%',
              fontSize: '0.9rem',
              padding: '10px 0',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '5px',
              transition: '0.3s',
            }}
          >
            Tambah Anggota
          </CButton>
        </div>
  
        <hr className="my-4" />
  
        {/* Payment History */}
        <h3 style={{ textAlign: 'center'}}>Payment History</h3>
        <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div className="shimmer">Loading...</div>
        ) : (
          <CTable striped hover className="mt-4 shadow-sm">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{width:'80px'}}>Tahun</CTableHeaderCell>
                {months.map(month => (
                  <CTableHeaderCell key={month}>{month}</CTableHeaderCell>
                ))}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {years.map(year => (
                <CTableRow key={year}>
                  <CTableDataCell>{year}</CTableDataCell>
                  {months.map(month => {
                    const isPayed = payedMonths.some(p => p.month === month && p.year === year);
                    return (
                      <CTableDataCell 
                        key={month} 
                        style={{ 
                          backgroundColor: isPayed ? 'green' : '#e9ecef', 
                          color: isPayed ? 'white' : 'black', 
                          cursor: isPayed ? 'pointer' : 'default'
                        }}
                        onClick={() => isPayed && handleHistoryClick(year, month)}
                      >
                        {isPayed ? '✓' : ''}
                      </CTableDataCell>
                    );
                  })}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        </div>
      </CCardBody>
    </CCard>
  );
  
};

export default KeluargaDetail;
