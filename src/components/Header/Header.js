import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroup,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
} from "reactstrap";

import { logoutUser } from "../../actions/auth";
import { closeSidebar, openSidebar } from "../../actions/navigation";
import MenuIcon from "../Icons/HeaderIcons/MenuIcon";
import SearchBarIcon from "../Icons/HeaderIcons/SearchBarIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";

import ProfileIcon from "../../assets/navbarMenus/pfofileIcons/ProfileIcon";
import MessagesIcon from "../../assets/navbarMenus/pfofileIcons/MessagesIcon";
import TasksIcon from "../../assets/navbarMenus/pfofileIcons/TasksIcon";

import logoutIcon from "../../assets/navbarMenus/pfofileIcons/logoutOutlined.svg";
import basketIcon from "../../assets/navbarMenus/basketIcon.svg";
import calendarIcon from "../../assets/navbarMenus/calendarIcon.svg";
import envelopeIcon from "../../assets/navbarMenus/envelopeIcon.svg";
import mariaImage from "../../assets/navbarMenus/mariaImage.jpg";
import notificationImage from "../../assets/navbarMenus/notificationImage.jpg";
import userImg from "../../assets/user.svg";

import s from "./Header.module.scss";
import "animate.css";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);



  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const response = await fetch('https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/image', {
      });
      const data = await response.json();
      setImageData(data.last_value);
    }
    fetchImage();
  }, []);

//   return (
//     <div>
//       {imageData && (
//         <img src={`data:image/jpeg;base64,${imageData}`} alt="Adafruit API image" />
//       )}
//     </div>
//   );
// }


  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  const toggleSidebar = () => {
    if (props.sidebarOpened) {
      props.dispatch(closeSidebar());
    } else {
      const paths = props.location.pathname.split('/');
      paths.pop();
      props.dispatch(openSidebar());
    }
  }

  const doLogout = () => {
    props.dispatch(logoutUser());
  }

  return (
    <Navbar className={`${s.root} d-print-none`}>
      <div>
        <NavLink
          onClick={() => toggleSidebar()}
          className={`d-md-none mr-3 ${s.navItem}`}
          href="#"
        >
          <MenuIcon className={s.menuIcon} />
        </NavLink>
      </div>
      <Form className="d-none d-sm-block" inline>
        <FormGroup>
          <InputGroup className='input-group-no-border'>
            <Input id="search-input" placeholder="Tìm kiếm" className='focus'/>
            <InputGroupAddon addonType="prepend">
              <span>
                <SearchBarIcon/>
              </span>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </Form>
      <Nav className="ml-auto">
        <NavItem className="d-sm-none mr-4">
          <NavLink
            className=""
            href="#"
          >
            <SearchIcon />
          </NavLink>
        </NavItem>
        
        <Dropdown nav isOpen={menuOpen} toggle={() => toggleMenu()} className="tutorial-dropdown mr-2 mr-sm-3">
          <DropdownToggle nav>
            <div className={s.navbarBlock}>
              <i className={'eva eva-bell-outline'}/>
              <div className={s.count}></div>
            </div>
          </DropdownToggle>
          <DropdownMenu right className="navbar-dropdown notifications-dropdown" style={{ width: "340px" }}>
            
            <DropdownItem >
              <div>
                <div className="d-flex flex-row mb-1">
                  {/* <img src={mariaImage} alt="Maria" className={s.mariaImage} /> */}
                  <div className="d-flex flex-column">
                    <p className="body-3">AI detect</p>
                    {/* <p className="label muted">15 phút trước</p> */}
                  </div>
                </div>
                <img src={`data:image/jpeg;base64,${imageData}`} alt="Notification Icon" className={s.notificationImage}/>
                {/* <p className="body-2 muted">Em chụp hình gửi chị thùng rác số 4</p> */}
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>




        <Dropdown isOpen={notificationsOpen} toggle={() => toggleNotifications()} nav id="basic-nav-dropdown" className="ml-3">
          <DropdownToggle nav caret className="navbar-dropdown-toggle">
            <span className={`${s.avatar} rounded-circle float-left mr-2`}>
              <img src={userImg} alt="User"/>
            </span>
            <span className="small d-none d-sm-block ml-1 mr-2 body-1">Huy Thanh</span>
          </DropdownToggle>
          <DropdownMenu className="navbar-dropdown profile-dropdown" style={{ width: "194px" }}>
            <DropdownItem className={s.dropdownProfileItem}><ProfileIcon/><span>Cá nhân</span></DropdownItem>
            <DropdownItem href="/#/SmartHome" className={s.dropdownProfileItem}><TasksIcon/><span>Lịch biểu</span></DropdownItem>
            <DropdownItem href="/#/SmartHome/notifications" className={s.dropdownProfileItem}><MessagesIcon/><span>Tin nhắn</span></DropdownItem>
            <NavItem>
              <NavLink onClick={() => doLogout()} href="#">
                <button className="btn btn-primary rounded-pill mx-auto logout-btn" type="submit"><img src={logoutIcon} alt="Logout"/><span className="ml-1">Đăng xuất</span></button>
              </NavLink>
            </NavItem>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  )
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

