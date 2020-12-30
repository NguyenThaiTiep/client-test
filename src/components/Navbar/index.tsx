import { Avatar, Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import io from "socket.io-client";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./style.scss";
import { useDispatch, useSelector, useStore } from "react-redux";
import { RootState } from "../../store";
import { ActionUserLogout } from "../../service/store/userStore/action";
import { NavbarMobile } from "./Navbar-mobile";
import { dirServer } from "../../libs/dir";
import { NotificationType } from "../../service/store/notification/action";
import { loadLocation } from "../../loader/loaderLocation";
import { loadNotificationNews } from "../../loader/loadNotification";
import { RoleAdmin } from "../../libs/constants/role";
import { Notifications } from "../admin/dashboard/TopBar/Notification";
import { useHistory, useLocation } from "react-router";
let socket;

const HeaderItem = () => {
  const notifications = useSelector(
    (state: RootState) => state.Notification as { count: number }
  );
  const [active, setActive] = useState("/home");
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    let path = location.pathname;

    setActive(path);
  }, [location]);

  // just run the effect on pathname and/or search change
  useEffect(() => {
    try {
      // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (error) {
      // just a fallback for older browsers
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location]);
  const store = useStore();
  const user = useSelector((state: RootState) => state.UserReducer);
  const dispatch = useDispatch();
  const clear = () => {
    dispatch(ActionUserLogout());
  };
  useEffect(() => {
    socket = io(dirServer);
    socket.on(NotificationType.NEW_NOTIFICATION, () => {
      loadNotificationNews(store);
    });
  }, []);
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (user && user.account?.id && token && token != "") {
      loadNotificationNews(store);
    }
  }, [location]);
  const getName = () => {
    let name = { ...user }.account?.name as string;
    if (name) return name.split(" ").reverse().shift();
  };
  const HeaderUser = () => {
    return user.account?.id ? (
      <div className="header-flex d-flex">
        <div className="avatar">
          <Avatar
            src={
              user?.account?.avatar?.url ??
              "https://www.avatarins.com/image/homesmall.png"
            }
          />
        </div>
        <NavDropdown className="name" title={getName()} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={(e) => history.push("/admin")}>
            Thông tin
          </NavDropdown.Item>
          <NavDropdown.Item onClick={(e) => history.push("/changePassword")}>
            Đổi mật khẩu
          </NavDropdown.Item>
          <NavDropdown.Item onClick={clear}>Đăng xuất</NavDropdown.Item>
        </NavDropdown>
        {user.account?.role?.isCreateApartment && user.account.isApprove ? (
          <Button
            className={"post-button"}
            onClick={(e) => history.push("/apartment/add")}
          >
            Đăng Tin
          </Button>
        ) : null}
      </div>
    ) : (
      <Button className={"post-button"} onClick={(e) => history.push("/login")}>
        Đăng nhâp
      </Button>
    );
  };
  return (
    <div className={"HeaderItem"}>
      <Navbar className={"navbar-custom"} expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand href="/home" className={"name-app"}>
            <div className={"text-navbar"}>
              TIMTRO.<small>vn</small>
            </div>
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                onClick={() => history.push("/home")}
                active={active === "/home"}
              >
                <div className={"text-navbar"}>Trang chủ</div>
              </Nav.Link>
              <Nav.Link
                onClick={() => history.push("/link")}
                active={active === "/link"}
              >
                <div className={"text-navbar"}>Giới thiệu</div>
              </Nav.Link>
              <Nav.Link
                onClick={() => history.push("/terms")}
                active={active === "/terms"}
              >
                <div className={"text-navbar"}>Điều khoản</div>
              </Nav.Link>
            </Nav>
            {user?.account?.id &&
              user.account.role?.code !== RoleAdmin.RENTER && <Notifications />}
            <HeaderUser />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <NavbarMobile className="navbar-mobile" />
    </div>
  );
};

export default HeaderItem;
