import { Avatar, makeStyles } from "@material-ui/core";
import { CheckCircleRounded, EmailOutlined, Phone} from "@material-ui/icons";
import React from "react";
import { UserTitleDto } from "../../api/user/user/dto";
import {
  convertDate,
  NumberDateJoin,
} from "../../libs/constants/function/time";
import "./style.scss";
import {useHistory} from "react-router";

interface Props {
  user?: UserTitleDto;
}
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));
export const SideBarApartment = (props: Props) => {
  const { user } = props;
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className="sibar-apartment">
      <div className="user-box">
        <div className="user-info">
          <div className="avatar">
            <Avatar
              src={
                user?.avatar?.url ||
                "https://cloud.mogi.vn/images/2020/11/21/581/537107b650a3455abcaa6396570f0217.jpg"
              }
              className={classes.large}
              // size={32}
            />
          </div>
          <div className="user-info-title">
            <a
              onClick={()=>history.push("/profileUser/" + user?.id)}
              data-rb-event-key="/profileUser"
              className="nav-link"
            >
              <div className="name"> {user?.name}</div>
            </a>
            <div className="time">
              {" "}
              Đã tham gia {NumberDateJoin(user?.create_at)}
            </div>
          </div>
        </div>
        <div className="contact row">
          <div className="col-6 contact-item">
            <Phone color="primary" /> {"  "}
            <span>{user?.contactUser?.phone}</span>
          </div>
          <div className="col-6 contact-item">
            <EmailOutlined color="primary" /> {"  "}
            <span>Gửi tin nhắn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
