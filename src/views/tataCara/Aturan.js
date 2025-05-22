import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
} from "@coreui/react";

const AturanPangruktilaya = () => {
  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol lg={10}>
          <CCard>
            <CCardHeader className="text-center bg-primary text-white">
              <h4>Aturan Pangruktilaya</h4>
            </CCardHeader>
            <CCardBody>
              <section>
                <h5 className="text-primary text-center">BAB I: PENDAHULUAN</h5>
                <h6 className="text-center">
                  <strong>Pasal 1: Azas dan Tujuan</strong>
                </h6>
                <ol>
                  <li>
                    Azas Pangruktilaya adalah kebersamaan gotong royong, dari,
                    oleh, dan untuk anggota.
                  </li>
                  <li>
                    Tujuan Pangruktilaya adalah mewujudkan jati diri paguyuban
                    Umat Allah untuk membangun semangat kebersamaan dan
                    solidaritas dalam peristiwa duka bagi anggotanya.
                  </li>
                </ol>
              </section>

              <section className="mt-4">
                <h5 className="text-primary text-center">
                  BAB II: KEANGGOTAAN DAN KEPENGURUSAN
                </h5>
                <h6 className="text-center">
                  <strong>Pasal 2: Syarat Keanggotaan</strong>
                </h6>
                <ol>
                  <li>
                    Umat Katolik dalam lingkup Paroki Kristus Raja Ungaran.
                  </li>
                  <li>
                    Mengajukan diri sebagai anggota melalui surat permohonan
                    tertulis yang diketahui oleh Ketua Lingkungan dengan
                    melampirkan fotokopi Kartu Keluarga (KK Sipil) dan Kartu
                    Keluarga Katolik (KK Katolik) yang masih berlaku untuk
                    mendapatkan Kartu Tanda Anggota (KTA).
                  </li>
                  <li>
                    Yang termasuk anggota adalah Keluarga Inti (suami, istri,
                    dan anak) yang beragama Katolik dan keluarga tambahan (orang
                    tua, mertua, famili lain, dan cucu) yang tinggal serumah dan
                    beragama Katolik.
                  </li>
                  <li>Menyetujui azas dan tujuan pangruktilaya.</li>
                </ol>

                <h6 className="text-center">
                  <strong>Pasal 3: Pengurus</strong>
                </h6>
                <ol>
                  <li>
                    Pengurus pangruktilaya adalah Tim Pelayanan Pangruktilaya
                    dalam Bidang Pelayanan Kemasyarakatan yang diangkat
                    berdasarkan Surat Keputusan Pastor Paroki selaku Ketua Dewan
                    Pastoral Paroki Kristus Raja Ungaran dengan masa bakti 3
                    (tiga) tahun.
                  </li>
                  <li>
                    Untuk kelancaran dalam pengelolaan pangruktilaya, Tim
                    Pelayanan dapat mengangkat tenaga sukarela sesuai dengan
                    kebutuhan.
                  </li>
                </ol>

                <h6 className="text-center">
                  <strong>
                    Pasal 4: Kewajiban, Hak Anggota, Tata Cara Pembayaran Iuran
                    dan Pengajuan Santunan
                  </strong>
                </h6>
                <ol>
                  <li>
                    <strong>Kewajiban anggota:</strong>
                    <ol type="a">
                      <li>Mematuhi segala ketentuan yang berlaku.</li>
                      <li>
                        Membayar iuran sebesar Rp. 10.000,- (sepuluh ribu
                        rupiah) setiap bulan atau Rp. 120.000,- (seratus dua
                        puluh ribu rupiah) setiap tahun untuk setiap Kepala
                        Keluarga Katolik.
                      </li>
                      <li>
                        Bagi anggota yang baru mendaftar wajib membayar iuran
                        kepesertaan 3 bulan diawal sekaligus.
                      </li>
                      <li>
                        Bagi Anggota yang selama 6 (enam) bulan berturut-turut
                        tidak membayar iuran bulanan, secara langsung dianggap
                        mengundurkan diri dari keanggotaan dan tidak mendapatkan
                        haknya kembali sebagai anggota.
                      </li>
                      <li>
                        Bagi anggota yang mengundurkan diri pada poin d dan
                        berkeinginan menjadi anggota kembali, wajib membayar
                        iuran yang belum dibayarkan sebelumnya atau membayar
                        iuran selama 12 bulan sekaligus apabila kepesertaan
                        telah beku lebih dari setahun.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>Hak anggota:</strong>
                    <ol type="a">
                      <li>
                        Mendapatkan santunan uang tunai sebesar Rp. 2.750.000,-
                        (dua juta tujuh ratus lima puluh ribu rupiah) bagi
                        anggota yang meninggal dunia yang masuk dalam keluarga
                        inti (suami, istri, atau anak) dan namanya tercantum
                        dalam Kartu Keluarga Katolik (KK Katolik) dan Kartu
                        Tanda Anggota (KTA) yang sesuai dengan Pasal 2 tentang
                        Syarat Keanggotaan.
                      </li>
                      <li>
                        Mendapatkan santunan uang tunai sebesar Rp. 1.250.000,-
                        (satu juta dua ratus lima puluh ribu rupiah) bagi
                        anggota tambahan (orang tua, mertua, famili lain, atau
                        cucu) yang meninggal dunia dan namanya tercantum dalam
                        Kartu Keluarga Katolik (KK Katolik) dan Kartu Tanda
                        Anggota (KTA) yang sesuai Pasal 2 tentang Syarat
                        Keanggotaan.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>Tata Cara Pembayaran Iuran:</strong>
                    <ol type="a">
                      <li>
                        Pembayaran iuran secara kolektif dalam 1 (satu)
                        lingkungan dan dibayarkan ke Pengurus Pangruktilaya
                        setiap bulan sesuai jadwal dalam bulan.
                      </li>
                      <li>
                        Pembayaran menyertakan kartu register yang telah diisi
                        sesuai anggota dalam lingkungan.
                      </li>
                      <li>
                        Pembayaran iuran dapat juga dilakukan melalui rekening
                        resmi paroki BCA 222 999 4888 an. PGPM Kristus Raja
                        Ungaran, dengan tata cara teknis yang telah ditentukan.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>Tata Cara Pengajuan Santunan:</strong>
                    <ol type="a">
                      <li>
                        Ketua Lingkungan mengajukan permohonan santunan ke
                        pengurus pangruktilaya dengan melampirkan fotokopi Kartu
                        Keluarga Katolik (KK Katolik), Kartu Tanda Anggota (KTA)
                        yang masih berlaku yang sesuai Pasal 2 tentang Syarat
                        Keanggotaan dan fotokopi kartu register iuran
                        kepesertaan anggota Pangruktilaya.
                      </li>
                    </ol>
                  </li>
                </ol>
              </section>

              <section className="mt-4">
                <h5 className="text-primary text-center">
                  BAB III: PENYELESAIAN PERSELISIHAN DAN PENUTUP
                </h5>
                <h6 className="text-center">
                  <strong>Pasal 5</strong>
                </h6>
                <ol>
                  <li>
                    Sesuai dengan azas dan tujuannya, maka apabila terjadi
                    perselisihan dalam pelayanan kepada anggota, akan
                    diselesaikan secara musyawarah dan mufakat.
                  </li>
                  <li>
                    Hal-hal yang belum diatur dalam petunjuk teknis, sepanjang
                    berkaitan dengan pelayanan anggota, pengurus dapat mengambil
                    tindakan setelah dikonsultasikan dengan Pastor Paroki.
                  </li>
                  <li>
                    Keputusan ini berlaku satu tahun sejak tanggal ditetapkan
                    atau sampai ada ketentuan baru sebagai pembaharuan dari
                    keputusan ini.
                  </li>
                </ol>

                <CRow className="justify-content-end">
                  <CCol xs="auto" className="text-end">
                    <p className="mb-1 fst-italic">
                      Surat Keputusan Pastor Paroki Kristus Raja Ungaran
                    </p>
                    <p className="mb-1">
                      <strong>Nomor:</strong> 030/SK/DP/KRU/III/2025
                    </p>
                    <p>
                      <strong>Tanggal:</strong> 26 Maret 2025
                    </p>
                  </CCol>
                </CRow>
              </section>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AturanPangruktilaya;
