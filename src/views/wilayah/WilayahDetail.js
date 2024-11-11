import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody } from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import services from '../../services';
import Swal from 'sweetalert2';

const WilayahDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wilayah } = location.state || {};

  const [formData, setFormData] = useState({
    Id: '',
    NamaWilayah: '',
    KodeWilayah: '',
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (wilayah) {
      const data = {
        Id: wilayah.Id,
        NamaWilayah: wilayah.NamaWilayah,
        KodeWilayah: wilayah.KodeWilayah,
      };
      setFormData(data);
      setInitialFormData(data); // Menyimpan nilai awal sebagai referensi
    }
  }, [wilayah]);

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
      const response = await services.WilayahService.updateWilayah(formData);

      await Swal.fire({
        title: 'Success!',
        text: 'Data has been updated successfully.',
        icon: 'success',
      });

    } catch (error) {
      console.error("Error updating data:", error);

      // Mengembalikan formData ke nilai awal jika error
      setFormData(initialFormData);

      await Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the data.',
        icon: 'error',
      });
    } finally {
      Swal.close();
      setIsEditable(false);
    }
  };

  return (
    <CCard>
      <CCardBody>
        <h5>Detail Wilayah</h5>
        <CForm onSubmit={handleSubmit}>
          {/* Input Id Wilayah */}
          <CFormInput
            type="text"
            id="idWilayah"
            floatingLabel="ID Wilayah"
            name="Id"
            value={formData.Id}
            onChange={handleChange}
            disabled
            className="mb-3"
          />

          {/* Input Nama Wilayah */}
          <CFormInput
            type="text"
            id="namaWilayah"
            floatingLabel="Nama Wilayah"
            name="NamaWilayah"
            value={formData.NamaWilayah}
            onChange={handleChange}
            disabled={!isEditable}
            className="mb-3"
          />

          {/* Input Kode Wilayah */}
          <CFormInput
            type="text"
            id="kodeWilayah"
            floatingLabel="Kode Wilayah"
            name="KodeWilayah"
            value={formData.KodeWilayah}
            onChange={handleChange}
            disabled={!isEditable}
            className="mb-3"
          />

          {/* Tombol Back */}
          <CButton color="secondary" onClick={handleBack} className="me-2">
            Back
          </CButton>

          {/* Tombol Edit */}
          <CButton color="info" onClick={handleEdit} className="me-2">
            Edit
          </CButton>

          {/* Tombol Submit */}
          <CButton color="primary" type="submit" disabled={!isEditable}>
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default WilayahDetail;
