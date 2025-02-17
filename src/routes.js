import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//GKRU-NEW
const Lingkungan = React.lazy(() => import('./views/lingkungan/Lingkungan'))
const AddLingkungan = React.lazy(() => import('./views/lingkungan/AddLingkungan'))
const LingkunganDetail = React.lazy(() => import('./views/lingkungan/LingkunganDetail'))
const User = React.lazy(() => import('./views/user/User'))
const UserDetail = React.lazy(() => import('./views/user/UserDetail'))
const AddUser = React.lazy(() => import('./views/user/AddUser'))
const History = React.lazy(() => import('./views/history/History'))
const HistoryDetail = React.lazy(() => import('./views/history/HistoryDetail'))
const PembayaranyDetail = React.lazy(() => import('./views/history/PembayaranDetail'))
const Santunan = React.lazy(() => import('./views/transaction/TransactionOutForm'))
const Iuran = React.lazy(() => import('./views/transaction/TransactionInForm'))
const Wilayah = React.lazy(() => import('./views/wilayah/Wilayah'))
const WilayahDetail = React.lazy(() => import('./views/wilayah/WilayahDetail'))
const AddWilayah = React.lazy(() => import('./views/wilayah/AddWilayah'))
const Keluarga =  React.lazy(() => import('./views/keluarga/Keluarga'))
const KeluargaDetail =  React.lazy(() => import('./views/keluarga/KeluargaDetail'))
const AddKeluarga =  React.lazy(() => import('./views/keluarga/AddKeluarga'))
const AnggotaDetail = React.lazy(() => import('./views/anggota/AnggotaDetail'))
const AddAnggota =  React.lazy(() => import('./views/anggota/AddAnggota'))
const Laporan =  React.lazy(() => import('./views/laporan/Laporan'))
const LaporanSetoran =  React.lazy(() => import('./views/laporan/LaporanSetoran'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const Aturan = React.lazy(() => import('./views/tataCara/Aturan'))
const AturanIuran = React.lazy(() => import('./views/tataCara/Iuran'))
const Pembayaran = React.lazy(() => import('./views/tataCara/Pembayaran'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, adminOnly: true },
  { path: '/aturan', name: 'Aturan Pangruktilaya', element: Aturan },
  { path: '/aturanFormIuran', name: 'Tata Cara Mengisi Form Iuran', element: AturanIuran },
  { path: '/Pembayaran', name: 'Tata Cara Pembayaran', element: Pembayaran },
  //new path GKRU-APP
  { path: '/lingkungan', name: 'Data Lingkungan', element: Lingkungan },
  { path: '/lingkungan/add', name: 'Add Lingkungan', element: AddLingkungan, adminOnly: true },
  { path: '/lingkungan/:id', name: 'Detail Lingkungan', element: LingkunganDetail },
  { path: '/user', name: 'Data User', element: User, adminOnly: true },
  { path: '/user/:id', name: 'Data User', element: UserDetail, adminOnly: true },
  { path: '/user/add', name: 'Data User', element: AddUser, adminOnly: true },
  { path: '/history', name: 'Data Kas Masuk dan Keluar', element: History },
  { path: '/history/:id', name: 'Detail History', element: HistoryDetail },
  { path: '/pembayaranDetail/:id', name: 'Detail Pembayaran', element: PembayaranyDetail, adminOnly: true },
  { path: '/santunan', name: 'Form Santunan', element: Santunan, adminOnly: true },
  { path: '/iuran', name: 'Form Iuran Bulanan', element: Iuran},
  { path: '/wilayah', name: 'Data Wilayah', element: Wilayah },
  { path: '/wilayah/:id', name: 'Detail Wilayah', element: WilayahDetail },
  { path: '/wilayah/add', name: 'Add Wilayah', element: AddWilayah, adminOnly: true },
  { path: '/keluarga', name: 'Data Keluarga Anggota', element: Keluarga },
  { path: '/keluarga/add', name: 'Add Keluarga', element: AddKeluarga },
  { path: '/keluarga/:id', name: 'Data Keluarga Anggota', element: KeluargaDetail },
  { path: '/anggota/:id', name: 'Detail Anggota', element: AnggotaDetail },
  { path: '/anggota/add', name: 'Add Anggota', element: AddAnggota, adminOnly: true },
  { path: '/laporan', name: 'Laporan Keuangan', element: Laporan, adminOnly: true },
  { path: '/laporanSetoran', name: 'Laporan Setoran Bulanan', element: LaporanSetoran, adminOnly: true },
  { path: '/notFound', name: 'Tidak Ditemukan', element: NotFound },
]

export default routes
