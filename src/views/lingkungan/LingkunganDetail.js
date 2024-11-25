import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody } from '@coreui/react';
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
        Wilayah: lingkungan.Wilayah.Id,
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
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditable(true);
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
      const response = await services.LingkunganService.updateLingkungan(formData);

      await Swal.fire({
        title: 'Success!',
        text: 'Data has been updated successfully.',
        icon: 'success',
      });

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
          <h5>Detail Lingkungan</h5>
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
