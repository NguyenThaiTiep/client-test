/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { useHistory, useLocation } from "react-router-dom";
import Icon from "awesome-react-icons";
import React, { useEffect, useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
interface Props {
  navActive: boolean;
}

const NavData = [
  {
    title: "Thông tin chính",
    items: [
      {
        title: "Thống kê",
        itemId: "/profile",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Thông tin cá nhân",
        itemId: "/profile/info",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
  {
    title: "Phòng trọ",
    items: [
      {
        title: "Bài đăng",
        itemId: "/profile/post",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Bài đăng yêu thích",
        itemId: "/profile/apartment",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
  {
    title: "Người dùng",
    items: [
      {
        title: "Admin",
        itemId: "/profile/user/admin",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Người cho thuê",
        itemId: "/profile/user/owner",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Người đi thuê",
        itemId: "/profile/user/renter",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
  {
    title: "Phê duyệt",
    items: [
      {
        title: "Bài đăng",
        itemId: "/profile/apartment/post",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Bình luận",
        itemId: "/profile/apartment/comment",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Báo cáo",
        itemId: "/profile/apartment/report",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      {
        title: "Chat với admin",
        itemId: "/profile/support",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
  {
    title: "Quản lý dữ liệu",
    items: [
      {
        title: "Tỉnh thành",
        itemId: "/profile/data/location",
        elemBefore: () => <Icon name="coffee" />,
      },
      {
        title: "Phòng trọ",
        itemId: "/profile/data/apartment",
        elemBefore: () => <Icon name="coffee" />,
      },
    ],
  },
];
export const NavSidebar = (props: Props) => {
  const user = useSelector((state: RootState) => state.UserReducer);
  const history = useHistory();
  const location = useLocation();
  const { navActive } = props;
  const getClass = () => {
    return navActive ? " " : "active";
  };
  const getActiveClass = (itemTitle: string) => {
    return itemTitle === activeNavbar ? "active" : "";
  };
  const [activeNavbar, setActiveNavbar] = useState(location.pathname);
  useEffect(() => {
    setActiveNavbar(location.pathname);
  }, []);
  return (
    // <React.Fragment>
    <>
      <div className="navbar-profile">
        <div className={"vertical-nav bg-white " + getClass()} id="sidebar">
          <div className="py-4 px-3 mb-4 bg-light">
            <div className="media d-flex align-items-center">
              <img
                src={
                  user?.account?.avatar?.url ??
                  "https://www.avatarins.com/image/homesmall.png"
                }
                alt="..."
                width={65}
                className="mr-3 rounded-circle img-thumbnail shadow-sm"
              />
              <div className="media-body">
                <h4 className="m-0">{user?.account?.name}</h4>
              </div>
            </div>
          </div>

          {NavData.map((nav) => {
            return (
              <div className="nav-item-header">
                <p className="text-gray font-weight-bold text-uppercase  small title-nav">
                  {nav.title}
                </p>
                <ul className="nav flex-column bg-white mb-0">
                  {nav.items.map((item) => {
                    return (
                      <li className={"nav-item " + getActiveClass(item.itemId)}>
                        <div
                          className={"nav-link  d-flex "}
                          onClick={() => {
                            history.push(item.itemId);
                            setActiveNavbar(item.itemId);
                          }}
                        >
                          {item.elemBefore()}
                          <span>{item.title}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
