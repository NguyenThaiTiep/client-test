import {
  faAngleLeft,
  faAngleRight,
  faPhoneAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Chip, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Carousel, Col, Image, Row, Table, Button } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
} from "react-share";
import "./style.scss";
import NumberFormat from "react-number-format";
import {
  convertDate,
  NumberDateJoin,
} from "../../libs/constants/function/time";
import { ApartmentGetDto } from "../../api/apartment/apartment/dto";
import { CommentComponent } from "../comment";
import { ApartmentApi } from "../../api/apartment/apartment";
import { handleToast } from "../../service/Toast";
import { ApartmentReportApi } from "../../api/apartment/apartmentReport";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AccountDto } from "../../api/user/user/dto";
import { EmploymentAPI } from "../../api/admin/employment";
import { useHistory } from "react-router";
interface Props {
  apartment: ApartmentGetDto;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginTop: 5,
    marginLeft: 3,
  },
  location: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    height: theme.spacing(4),
    color: "#214234",
    fontSize: 12,
    fontWeight: "bold",
    textDecoration: "none",
  },
}));
export const FormatNumber = (n?: number, suffix = "", prefix = "") => {
  return (
    <NumberFormat
      value={n || 0}
      displayType={"text"}
      thousandSeparator={true}
      suffix={suffix}
      prefix={prefix}
    />
  );
};
export const ApartmentDetailItem = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const { apartment } = props;

  const getAddress = () => {
    return `${apartment?.streetNo ? apartment?.streetNo + "," : ""}
    ${apartment?.street?.name ? apartment?.street?.name + "," : ""}
    ${apartment?.ward?.name ? apartment?.ward?.name + "," : ""}
    ${apartment?.district?.name ? apartment?.district?.name : ""} `;
  };
  const [canComment, setCanComment] = useState(false);
  const user = useSelector(
    (state: RootState) => state.UserReducer.account as AccountDto
  );
  useEffect(() => {
    if (!apartment.user) {
      apartment.user = user;
    }
  }, [apartment]);
  const addToHobby = () => {
    ApartmentApi.saveToHobby(apartment.id).then((res) => {
      handleToast(res.data);
    });
  };
  const report = () => {
    ApartmentReportApi.create(apartment.id).then((res) => {
      handleToast(res.data);
    });
  };
  const getYesNo = (e?: boolean) => {
    return e ? "Có" : "Không";
  };
  const approve = () => {
    EmploymentAPI.approveApartment(apartment?.id).then((res) => {
      handleToast(res.data);
      if (res.data.status === 200) {
        history.push("/apartment/" + apartment.id);
      }
    });
  };
  return (
    <div className="apartment-detail-item">
      <div className="slide-apartment">
        <Carousel
          nextIcon={
            <FontAwesomeIcon icon={faAngleRight} color="black" size={"2x"} />
          }
          prevIcon={
            <FontAwesomeIcon icon={faAngleLeft} color="black" size={"2x"} />
          }
          interval={5000}
        >
          {apartment.apartmentDetail?.images &&
          apartment.apartmentDetail?.images.length !== 0 ? (
            apartment.apartmentDetail?.images.map((i) => (
              <Carousel.Item>
                <Image
                  className="d-block w-100 image-detail"
                  src={i.url}
                  alt="First slide"
                  thumbnail
                />
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <Image
                className="d-block w-100 image-detail"
                src="https://cloud.mogi.vn/images/2020/11/03/456/82ee2b80fe4243e1a238bca87babb205.jpg"
                alt="First slide"
                thumbnail
              />
            </Carousel.Item>
          )}
        </Carousel>
      </div>
      <div className="info">
        <div className="info-title">
          <div className="title">{apartment.title || "Tiêu đề"}</div>
          <div className="address">{getAddress()}</div>
          <div className="price">{FormatNumber(apartment.price, " vnđ")}</div>
        </div>
        <div className="info-main">
          <div className="title">Thông tin chính</div>
          <div className="info-content">
            <Row>
              <Col md={6} xs={12}>
                <div className="item-info">
                  <span className="item-title">Giá tiền</span>
                  <span className="data">
                    : {FormatNumber(apartment.price, " vnđ")}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Diện tích</span>
                  <span className="data">
                    : {apartment.apartmentDetail?.acreage || 0} m<sup>2</sup>
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Ngày đăng</span>
                  <span className="data">
                    : {convertDate(apartment.create_at)}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Loại hình</span>
                  <span className="data">: {apartment.type?.name}</span>
                </div>
                <div className="item-info">
                  <span className="item-title">Giá điện</span>
                  <span className="data">
                    :{" "}
                    {FormatNumber(
                      apartment.apartmentDetail?.priceElectricity,
                      "/số"
                    )}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Giá nước</span>
                  <span className="data">
                    :{" "}
                    {FormatNumber(
                      apartment.apartmentDetail?.priceWater,
                      "/khối"
                    )}
                  </span>
                </div>{" "}
              </Col>

              <Col md={6} xs={12}>
                <div className="item-info">
                  <span className="item-title">Thang máy</span>
                  <span className="data">
                    : {getYesNo(apartment.apartmentDetail?.isHasElevator)}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Điều hòa</span>
                  <span className="data">
                    : {getYesNo(apartment.apartmentDetail?.isHasAirConditioner)}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Ban Công</span>
                  <span className="data">
                    : {getYesNo(apartment.apartmentDetail?.isHasBalcony)}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Vệ sinh</span>
                  <span className="data">
                    : {apartment.apartmentDetail?.toiletType?.name}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Bếp</span>
                  <span className="data">
                    : {apartment.apartmentDetail?.kitchenType?.name}
                  </span>
                </div>
                <div className="item-info">
                  <span className="item-title">Chỗ để xe</span>
                  <span className="data">
                    : {getYesNo(apartment.apartmentDetail?.isHasParking)}
                  </span>
                </div>{" "}
              </Col>
            </Row>
          </div>
        </div>
        <div className="info-detail">
          <div className="title">Mô tả chi tiết</div>
          <div className="content-post">
            {ReactHtmlParser(apartment?.apartmentDetail?.description || "")}
          </div>
        </div>
        <div className="location">
          <div className="title">Địa điểm lân cận</div>

          {apartment.near?.map((item) => (
            <Chip
              className={classes.location}
              label={item.location?.name}
              component="a"
              href="#chip"
              clickable
              variant="outlined"
            />
          ))}
        </div>
      </div>
      {apartment.user && (
        <div className="d-flex user-info ">
          <div className=" user-item" style={{ flexGrow: 1 }}>
            <Avatar
              src={apartment?.user?.avatar?.url || user.avatar?.url}
              className={classes.large}
            />
            <div className="user">
              <div className="name">{apartment?.user?.name || user.name}</div>
              <div className="time">
                Đã tham gia{" "}
                {NumberDateJoin(apartment?.user?.create_at || new Date())}
              </div>
            </div>
          </div>
          <div className="box ">
            <div className="contact-box">
              <div className="contact">
                <FontAwesomeIcon icon={faPhoneAlt} color={"#009177"} />
                <span>{apartment?.user?.contactUser?.phone}</span>
              </div>
              <div className="reviewStar">
                <FontAwesomeIcon icon={faStar} color={"#009177"} />
                <span> 4.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {apartment.isApprove ? (
        <>
          <div className="row review-share ">
            <div className="col-md-9 col-12 review ">
              <ul>
                <li>
                  <Chip
                    className={classes.location}
                    label="Lưu"
                    component="a"
                    onClick={addToHobby}
                    clickable
                    variant="outlined"
                  />
                </li>
                <li>
                  <Chip
                    className={classes.location}
                    label="Bình luận"
                    component="a"
                    clickable
                    variant="outlined"
                    color="primary"
                    onClick={() => setCanComment(!canComment)}
                  />
                </li>
                <li>
                  <Chip
                    className={classes.location}
                    label="Báo cáo "
                    component="a"
                    clickable
                    onClick={report}
                    variant="outlined"
                    color="secondary"
                  />
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-12 icon-share">
              <FacebookShareButton
                url="https://github.com/NguyenThaiTiep"
                quote={"Nguyen Thai Tiep"}
                className="share"
              >
                <FacebookIcon size={48} round={true} />
              </FacebookShareButton>
              <FacebookMessengerShareButton
                url={"https://github.com/NguyenThaiTiep"}
                title={"please click me"}
                appId="100008957765110"
              >
                <FacebookMessengerIcon size={48} round />
              </FacebookMessengerShareButton>
            </div>
          </div>
          <div className="comment">
            {canComment && <CommentComponent apartmentId={apartment.id} />}
          </div>
        </>
      ) : (
        <>
          {apartment.pricePost && user && user.role?.isApproveApartment ? (
            <div className="info-price">
              <Table striped bordered hover className="user-table">
                <thead>
                  <tr className={"text-center"}>
                    {["Mã gói", "Thời gian", "Giá tiền"].map((item) => (
                      <th>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className={"text-center"}>
                    <td>{apartment.pricePost.code}</td>
                    <td>{apartment.pricePost.name}</td>
                    <td>{FormatNumber(apartment.pricePost.price, " vnđ")}</td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="outline-success" block onClick={approve}>
                Duyệt bài đăng
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
