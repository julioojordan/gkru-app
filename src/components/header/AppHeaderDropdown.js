import React from "react";
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

import avatar from "./../../assets/images/avatars/person.png";
import { logout } from "../../actions";

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();

  const [, , removeCookie] = useCookies(["auth_token"]);
  const navigate = useNavigate();
  const idUser = useSelector((state) => state.auth.id);

  const handleProfileClick = () => {
    navigate(`/user/${idUser}`, { state: { isSelf: true } });
  };

  const handleLogout = () => {
    removeCookie("auth_token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>
        <CDropdownItem
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        >
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
          <CIcon icon={cilSettings} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
