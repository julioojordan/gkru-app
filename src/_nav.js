import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilMoney,
  cilSpreadsheet,
  cilUser,
  cilFolder,
  cilInfo,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import { useSelector } from "react-redux";

const getNavItems = (roleRedux) => [
  ...(roleRedux === "admin"
    ? [
        {
          component: CNavItem,
          name: "Dashboard",
          to: "/dashboard",
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: "User",
          to: "/user",
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
      ]
    : []),
  {
    component: CNavItem,
    name: "Aturan Pangruktilaya",
    to: "/aturan",
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Tata Cara Pengisian Form",
    to: "/aturanFormIuran",
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Tata Cara Pembayaran",
    to: "/pembayaran",
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Data",
  },
  {
    component: CNavItem,
    name: "Data Lingkungan",
    to: "/lingkungan",
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Data Wilayah",
    to: "/wilayah",
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Data Keluarga Anggota",
    to: "/keluarga",
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Transaksi",
  },

  ...(roleRedux === "admin"
    ? [
        {
          component: CNavItem,
          name: "Kas Masuk dan Keluar",
          to: "/history",
          icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: "Form Santunan",
          to: "/santunan",
          icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
        },
      ]
    : []),
  {
    component: CNavItem,
    name: "Form Iuran Bulanan",
    to: "/iuran",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  ...(roleRedux === "admin"
    ? [
        {
          component: CNavTitle,
          name: "Laporan",
        },
        {
          component: CNavItem,
          name: "Laporan Setoran Bulanan",
          to: "/laporanSetoran",
          icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: "Laporan Tahunan",
          to: "/laporan",
          icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
        },
      ]
    : []),
];

const Navigation = () => {
  const roleRedux = useSelector((state) => state.role.role);
  const navItems = getNavItems(roleRedux);

  return navItems;
};

export default Navigation;

// export default _nav
