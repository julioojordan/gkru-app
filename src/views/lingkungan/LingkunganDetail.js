import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody, CCardSubtitle } from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import services from '../../services';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useAuth } from '../../hooks/useAuth';

const LingkunganDetail = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lingkungan } = location.state || {};

  const [formData, setFormData] = useState({
    Id: '',
    NamaLingkungan: '',
    KodeLingkungan: '',
    Wilayah: ''
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [wilayahOptions, setWilayahOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lingkungan) {
      const data = {
        Id: lingkungan.Id,
        NamaLingkungan: lingkungan.NamaLingkungan,
        KodeLingkungan: lingkungan.KodeLingkungan,
        Wilayah: lingkungan.Wilayah && lingkungan.Wilayah.Id ? lingkungan.Wilayah.Id : lingkungan.Wilayah,
      };
      setFormData(data);
      setInitialFormData(data);
    }
  }, [lingkungan]);

  useEffect(() => {
    const fetchWilayah = async () => {
      setLoading(true);
      try {
        const response = await services.WilayahService.getAllWilayah();
        const options = response.map(wilayah => ({
          value: wilayah.Id,
          label: wilayah.NamaWilayah,
        }));
        setWilayahOptions(options);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWilayah();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      Wilayah: selectedOption ? selectedOption.value : '', // Menyimpan value yang dipilih
    }));
  };

  const handleBack = () => {
    navigate("/lingkungan");
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Apakah Anda yakin ?',
        text: 'Data yang dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      });
  
      if (result.isConfirmed) {
        const loadingAlert = Swal.fire({
          title: 'Loading...',
          text: 'Please wait...',
          allowOutsideClick: false,
        });
        const response = await services.LingkunganService.deleteLingkungan(lingkungan.Id);
  
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(
          navigate("/lingkungan")
        );
      }
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus data.',
        icon: 'error',
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      allowOutsideClick: false
    });

    try {
      const response = await services.LingkunganService.updateLingkungan(formData);

      await Swal.fire({
        title: 'Success!',
        text: 'Data has been updated successfully.',
        icon: 'success',
      }).then(
        navigate(`/lingkungan/${response.Id}`, { state: { lingkungan: response } })
      );

    } catch (error) {
      setFormData(initialFormData);
      setTimeout(() => {
        handleSelectChange(wilayahOptions.find(option => option.value === initialFormData.Wilayah));
      }, 0);

      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error updating the data.",
          icon: "error",
        });
      }
    } finally {
      Swal.close();
      setIsEditable(false);
    }
  };

  return (
    <CCard>
      {loading ? (
          <div className="shimmer">Loading...</div>
        ) : (
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center">
          <CCardSubtitle className="mb-2 text-body-secondary" style={{ marginLeft: '3px' }}>Detail Lingkungan</CCardSubtitle>
          <CButton
              color="danger"
              onClick={() => {handleDelete()}}
              style={{ fontSize: '16px', lineHeight: '1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', marginBottom:'9px', color: 'white', fontWeight: 'bold', transition: '0.3s' }}
          >
              Delete
          </CButton>
        </div>
          <CForm onSubmit={handleSubmit}>
            {/* Input Id Lingkungan */}
            <CFormInput
              type="text"
              id="idLingkungan"
              floatingLabel="ID Lingkungan"
              name="Id"
              value={formData.Id}
              onChange={handleChange}
              disabled
              className="mb-3"
            />

            <CFormInput
              type="text"
              id="namaLingkungan"
              floatingLabel="Nama Lingkungan"
              name="NamaLingkungan"
              value={formData.NamaLingkungan}
              onChange={handleChange}
              disabled={!isEditable}
              className="mb-3"
            />

            <CFormInput
              type="text"
              id="kodeLingkungan"
              floatingLabel="Kode Lingkungan"
              name="KodeLingkungan"
              value={formData.KodeLingkungan}
              onChange={handleChange}
              disabled={!isEditable}
              className="mb-3"
            />

            <Select
              options={wilayahOptions}
              value={wilayahOptions.find(option => option.value === formData.Wilayah)} // Gunakan formData untuk value
              onChange={handleSelectChange}
              placeholder="Select Wilayah"
              isDisabled={!isEditable}
              isSearchable
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                  marginBottom: '1rem',
                }),
                control: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                  borderColor: '#ced4da',
                  borderWidth: '1px',
                  borderRadius: '0.375rem',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1050,
                }),
              }}
              required
            />

            <CButton color="secondary" onClick={handleBack} className="me-2"
            style= {{
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
              Back
            </CButton>

            {/* Tombol Edit */}
            <CButton color="info" onClick={handleEdit} className="me-2"
            style= {{
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

            {/* Tombol Submit */}
            <CButton color="primary" type="submit" disabled={!isEditable}
            style= {{
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
          </CForm>
        </CCardBody>
        )}
    </CCard>
  );
};

export default LingkunganDetail;
