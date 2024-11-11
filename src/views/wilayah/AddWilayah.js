import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody } from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import services from '../../services';
import Swal from 'sweetalert2';

const WilayahDetail = () => {
  const navigate = useNavigate();
  const data = {
    NamaWilayah: '',
    KodeWilayah: '',
  };

  const [formData, setFormData] = useState(data);
  const [initialFormData, ] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate(-1);
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
      const response = await services.WilayahService.AddWilayah(formData);

      await Swal.fire({
        title: 'Success!',
        text: 'Data has been added successfully.',
        icon: 'success',
      });

    } catch (error) {

      await Swal.fire({
        title: 'Error!',
        text: 'There was an error adding the data.',
        icon: 'error',
      });
    } finally {
      Swal.close();
      setFormData(initialFormData);
    }
  };

  return (
    <CCard>
      <CCardBody>
        <h5>Add Wilayah</h5>
        <CForm onSubmit={handleSubmit}>

          {/* Input Nama Wilayah */}
          <CFormInput
            type="text"
            id="namaWilayah"
            floatingLabel="Nama Wilayah"
            name="NamaWilayah"
            value={formData.NamaWilayah}
            onChange={handleChange}
            className="mb-3"
            required
          />

          {/* Input Kode Wilayah */}
          <CFormInput
            type="text"
            id="kodeWilayah"
            floatingLabel="Kode Wilayah"
            name="KodeWilayah"
            value={formData.KodeWilayah}
            onChange={handleChange}
            className="mb-3"
            required
          />

           {/* Tombol Back */}
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
          {/* Tombol Submit */}
          <CButton color="primary" type="submit"
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
    </CCard>
  );
};

export default WilayahDetail;
