import React, { useState, useEffect } from 'react';
import { CForm, CFormInput, CButton, CCard, CCardBody, CCardSubtitle } from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import services from '../../services';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';

const WilayahDetail = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
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
    navigate("/wilayah");
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDelete = async () => {
    try {
      // Memunculkan dialog konfirmasi
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
        const response = await services.WilayahService.deleteWilayah(wilayah.Id);
  
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(
          navigate("/wilayah")
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
      }).then(
        navigate(`/wilayah/${response.Id}`, { state: { wilayah: response } })
      );

    } catch (error) {
      setFormData(initialFormData);
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
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center">
          <CCardSubtitle className="mb-2 text-body-secondary" style={{ marginLeft: '3px' }}>Detail Wilayah</CCardSubtitle>
          <CButton
              color="danger"
              onClick={() => {handleDelete()}}
              style={{ fontSize: '16px', lineHeight: '1', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', marginBottom:'9px', color: 'white', fontWeight: 'bold', transition: '0.3s' }}
          >
              Delete
          </CButton>
        </div>
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
    </CCard>
  );
};

export default WilayahDetail;
