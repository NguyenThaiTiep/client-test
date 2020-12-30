import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { DistrictForProvinceDto } from "../../api/address/district/dto/districtOfProvince";
import { LocationOfProvinceDto } from "../../api/address/location/dto/get";
import { StreetsOfDistrict } from "../../api/address/street/dto/streetInDistrict";
import { WardsOfDistrictDto } from "../../api/address/ward/dto/wardInDistrict";
import {
  ApartmentGetDto,
  ApartmentInputDto,
} from "../../api/apartment/apartment/dto";
import { ApartmentDetailInputDto } from "../../api/apartment/apartmentDetail/dto";
import { CheckBoxInput } from "../../containers/Input/checkbox";
import { SearchFilterInput } from "../../containers/Input/searchFilter";
import { InputSelect } from "../../containers/Input/select";
import { TextFieldInput } from "../../containers/Input/textField";
import { UploadImage } from "../../containers/Input/uploadImage";
import { ChipLabel } from "../../containers/Label/chip";
import { addWards } from "../../loader/loadDataWard";
import { addDistrict } from "../../loader/loadDataDistrict";
import {
  apartmentClear,
  apartmentInputChange,
} from "../../service/store/apartment/action";
import { RootState } from "../../store";
import { EditorComponent } from "../editor";
import "./style.scss";
import { addStreets } from "../../loader/loaderStreet";
import { loadLocation } from "../../loader/loaderLocation";

import { ApartmentApi } from "../../api/apartment/apartment";

import { handleToast } from "../../service/Toast";
import { ApartmentDetailApi } from "../../api/apartment/apartmentDetail";

import {
  loadapartmentType,
  loadKitchenType,
  loadToiletType,
} from "../../loader/loadDataApartment";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { PriceDto } from "../../api/payment/price/dto/price.get.dto";
import { PriceApi } from "../../api/payment/price";
import { FormatNumber } from "../apartment-detail-item";

interface Props {
  id?: string;
}

export const AddApartment = (props: Props) => {
  const store = useStore();
  const [dataPostPrice, setDataPostPrice] = useState([] as PriceDto[]);
  const dispatch = useDispatch();
  const history = useHistory();
  const apartment = useSelector(
    (state: RootState) => state.Apartment as ApartmentGetDto
  );
  const province = useSelector((state: RootState) => state.Province.province);
  const wards = useSelector(
    (state: RootState) =>
      state.Ward as { state: boolean; wards: WardsOfDistrictDto[] }
  );
  const district = useSelector(
    (state: RootState) =>
      state.District as { state: boolean; districts: DistrictForProvinceDto[] }
  );
  const locations = useSelector(
    (state: RootState) =>
      state.Location as { state: boolean; locations: LocationOfProvinceDto[] }
  );
  const street = useSelector(
    (state: RootState) =>
      state.Street as { state: boolean; streets: StreetsOfDistrict[] }
  );

  const common = useSelector((state: RootState) => state.Common);

  const onChangeApartment = (key: string, value: any) => {
    dispatch(apartmentInputChange({ ...apartment, [key]: value }));
  };
  const onClear = () => {
    dispatch(apartmentClear());
    history.push("/apartment/add");
  };
  const getDistrict = () => {
    let districtData = district.districts.find(
      (i) => i.id === apartment.province?.id
    );
    if (!districtData) {
      if (!district.state) {
        addDistrict(store, apartment.province?.id || 0);
      }
      return [];
    }
    return districtData.districts as [];
  };
  const getPricePostData = () => {
    PriceApi.getAll().then((res) => {
      if (res.data.status) {
        setDataPostPrice(res.data.result);
      }
    });
  };
  const getWard = () => {
    let wardData = wards.wards.find((i) => i.id === apartment.district?.id);
    if (!wardData) {
      if (!wards.state) {
        addWards(store, apartment.district?.id || 0);
      }
      return [];
    }
    return wardData.wards as [];
  };
  const getStreet = () => {
    let streetData = street.streets.find(
      (i) => i.id === apartment.district?.id
    );
    if (!streetData) {
      if (!wards.state) {
        addStreets(store, apartment.district?.id || 0);
      }
      return [];
    }
    return streetData.streets as [];
  };
  const getLocation = () => {
    let location = locations.locations.find(
      (i) => i.id === apartment.province?.id
    );
    if (!location) {
      loadLocation(store, apartment.province?.id || 0);

      return [];
    }
    return location.locations as [];
  };
  const addLocationNear = (e: any) => {
    let locationNear = { ...apartment }.near || [];
    if (locationNear.find((i) => i?.location?.id === e.id)) return;
    locationNear?.push({ location: e });
    onChangeApartment("near", locationNear);
  };
  const removeLocationNear = (e: any) => {
    let locationNear = { ...apartment }.near || [];
    let newLocationNear = locationNear?.filter(
      (i) => i.location?.id !== e.id || i === null
    );
    onChangeApartment("near", newLocationNear || []);
  };

  const getUrls = () => {
    return apartment.apartmentDetail?.images;
  };

  const createApartment = async () => {
    let apartmentInput = convertApartmentToInput();
    let res = await ApartmentApi.create(apartmentInput);
    if (res.data.status === 200) {
      await createApartmentDetails(res.data.result.id);
    } else {
      handleToast(res.data);
    }
  };

  const createApartmentDetails = async (id: number) => {
    let apartmentDetail = convertApartmentDetailToInput(id);
    let res = await ApartmentDetailApi.create(apartmentDetail);
    if (res.data.status) {
      await handleToast(res.data);
      if (!apartment.id) {
        setTimeout(() => {
          history.push("/apartment/edit/" + id);
        }, 1000);
      }
    }
    if (res.data.status === 200) {
      let detail = apartment.apartmentDetail;
      dispatch(
        apartmentInputChange({
          ...apartment,
          id: id,
          apartmentDetail: { ...detail, id: res.data.result.id },
        })
      );
    } else {
      dispatch(
        apartmentInputChange({
          ...apartment,
          id: id,
        })
      );
    }
  };
  useEffect(() => {
    getPricePostData();
  }, []);
  const getLocationCodes = (array: any[]) => {
    let locationNear = [] as number[];
    array.forEach((element) => {
      if (element.id || element.location.id)
        locationNear.push(element.id || element.location.id);
    });

    return locationNear;
  };
  const addImg = (file: any) => {
    let formData = new FormData();
    formData.append("image", file);
    ApartmentApi.upload(formData).then((res) => {
      if (res.data.status === 200) {
        let imgs = { ...apartment.apartmentDetail }.images || [];
        imgs.push(res.data.result);

        onChangeApartment("apartmentDetail", {
          ...apartment.apartmentDetail,
          images: imgs,
        });
      } else {
        handleToast(res.data);
      }
    });
  };
  const dropImg = (id: number) => {
    ApartmentApi.removeImg(id).then((res) => {
      handleToast(res.data);
      if (res.data.status === 200 || res.data.status === 404) {
        let imgs = { ...apartment?.apartmentDetail }.images || [];
        imgs = imgs.filter((i) => i.id !== id);
        onChangeApartment("apartmentDetail", {
          ...apartment.apartmentDetail,
          images: imgs,
        });
      }
    });
  };
  const convertApartmentToInput = () => {
    let apartmentInput = { ...apartment } as ApartmentInputDto;
    apartmentInput.LocationsNearCode = getLocationCodes(apartment.near || []);
    apartmentInput.provinceId = apartment.province?.id;
    apartmentInput.districtId = apartment.district?.id;
    apartmentInput.streetId = apartment.street?.id;
    apartmentInput.wardId = apartment.ward?.id;
    apartmentInput.type = apartment.type?.id;
    apartmentInput.pricePostId = apartment.pricePost?.id;
    return apartmentInput;
  };
  const convertApartmentDetailToInput = (id: number) => {
    let apartmentDetail = {
      ...apartment.apartmentDetail,
    } as ApartmentDetailInputDto;
    apartmentDetail.apartmentId = id;
    apartmentDetail.toiletTypeId = apartment.apartmentDetail?.toiletType?.id;
    apartmentDetail.kitchenTypeId = apartment.apartmentDetail?.kitchenType?.id;
    apartmentDetail.imagesId = getLocationCodes(
      apartment.apartmentDetail?.images || []
    );

    return apartmentDetail;
  };
  const getApartmentType = () => {
    if (common.apartmentTypes.length !== 0) {
      return common.apartmentTypes;
    }
    loadapartmentType(store);
    return [];
  };
  const getKichentType = () => {
    if (common.kitchenTypes.length !== 0) {
      return common.kitchenTypes;
    }
    loadKitchenType(store);
    return [];
  };
  const getToiletType = () => {
    if (common.toiletTypes.length !== 0) {
      return common.toiletTypes;
    }
    loadToiletType(store);
    return [];
  };

  return (
    <div className="add-apartment">
      <div className="back-ground">
        <TextFieldInput
          value={apartment.title || ""}
          label={"Tiêu đề"}
          onChange={(e) => onChangeApartment("title", e)}
        />
        <div className="row">
          <div className="col-md-6 col-12">
            <InputSelect
              label={"Loại hình"}
              input={getApartmentType()}
              value={apartment.type?.id}
              onSelect={(e) => {
                onChangeApartment(
                  "type",
                  common.apartmentTypes.find((i) => i.id === e)
                );
              }}
            />
          </div>
          <div className="col-md-6 col-12">
            <TextFieldInput
              label={"Giá"}
              type="number"
              end="VNĐ"
              value={apartment.price || ""}
              onChange={(e) => {
                onChangeApartment("price", e);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-12">
            <InputSelect
              input={province}
              label={"Tỉnh/TP"}
              value={apartment.province?.id}
              onSelect={(e) => {
                dispatch(
                  apartmentInputChange({
                    ...apartment,
                    province: province.find((i) => i.id === e),
                    district: {},
                  })
                );
              }}
            />
          </div>
          <div className="col-md-4 col-12">
            <InputSelect
              input={getDistrict()}
              label={"Quận/huyện"}
              value={apartment.district?.id}
              onSelect={(e) => {
                let districtGet = district.districts.find(
                  (i) => i.id === apartment.province?.id
                );
                dispatch(
                  apartmentInputChange({
                    ...apartment,
                    district: districtGet?.districts?.find((i) => i.id === e),
                    ward: {},
                  })
                );
              }}
            />
          </div>
          <div className="col-md-4 col-12">
            <InputSelect
              label={"Phường/Xã"}
              input={getWard()}
              onSelect={(e) => {
                let wardGet = wards.wards.find(
                  (i) => i.id === apartment.district?.id
                );
                onChangeApartment(
                  "ward",
                  wardGet?.wards?.find((i) => i.id === e)
                );
              }}
              value={apartment.ward?.id}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-12">
            <InputSelect
              label={"Đường"}
              input={getStreet()}
              value={apartment.street?.id}
              onSelect={(e) => {
                let streetGet = street.streets.find(
                  (i) => i.id === apartment.district?.id
                );
                onChangeApartment(
                  "street",
                  streetGet?.streets?.find((i) => i.id === e)
                );
              }}
            />
          </div>
          <div className="col-md-8 col-12">
            <TextFieldInput
              label={"Địa chỉ chi tiết"}
              value={apartment.streetNo}
              onChange={(e) => {
                onChangeApartment("streetNo", e);
              }}
            />
          </div>

          {/*<div className="col-4">*/}
          {/*    <TextFieldInput*/}
          {/*        label={"Ghi chú"}*/}
          {/*        value=""*/}
          {/*    />*/}
          {/*</div>*/}
        </div>
      </div>

      <div className="upload">
        <UploadImage urls={getUrls()} addImg={addImg} dropImg={dropImg} />
      </div>
      <div className="back-ground">
        {/* <RadioInput input={dataCheck} inline={true} /> */}
        <div className="row">
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Diện tích"}
              type="number"
              value={apartment.apartmentDetail?.acreage}
              onChange={(e) =>
                dispatch(
                  apartmentInputChange({
                    ...apartment,
                    area: e,
                    apartmentDetail: {
                      ...apartment.apartmentDetail,
                      acreage: e,
                    },
                  })
                )
              }
              end={
                <span>
                  m <sup>2</sup>
                </span>
              }
            />
          </div>
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Giá điện"}
              type="number"
              end="/số"
              value={apartment.apartmentDetail?.priceElectricity}
              onChange={(e) =>
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  priceElectricity: e,
                })
              }
            />
          </div>
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Giá nước"}
              type="number"
              end="/khối"
              value={apartment.apartmentDetail?.priceWater}
              onChange={(e) =>
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  priceWater: e,
                })
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Giường"}
              type="number"
              value={apartment.bedRoom}
              onChange={(e) => onChangeApartment("bedRoom", e)}
              end={"chiếc"}
            />
          </div>
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Phòng tắm"}
              type="number"
              end="chiếc"
              value={apartment.bathRoom}
              onChange={(e) => onChangeApartment("bathRoom", e)}
            />
          </div>
          <div className="col-md-4 col-12 detail-item">
            <TextFieldInput
              label={"Tủ quần áo"}
              type="number"
              end="cái"
              value={apartment.wardrobe}
              onChange={(e) => onChangeApartment("wardrobe", e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-6">
            <CheckBoxInput
              value={apartment.apartmentDetail?.isHasElevator}
              onChange={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  isHasElevator: e,
                });
              }}
              label={"Thang máy"}
            />
          </div>
          <div className="col-md-3 col-6">
            <CheckBoxInput
              value={apartment.apartmentDetail?.isHasParking}
              onChange={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  isHasParking: e,
                });
              }}
              label="Chỗ để xe"
            />
          </div>
          <div className="col-md-3 col-6">
            <CheckBoxInput
              value={apartment.apartmentDetail?.isHasBalcony}
              onChange={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  isHasBalcony: e,
                });
              }}
              label="Ban công"
            />
          </div>
          <div className="col-md-3 col-6">
            <CheckBoxInput
              value={apartment.apartmentDetail?.isHasAirConditioner}
              onChange={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  isHasAirConditioner: e,
                });
              }}
              label="Điều hòa"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <InputSelect
              label={"Vệ Sinh"}
              input={getToiletType()}
              flex={true}
              value={apartment.apartmentDetail?.toiletType?.id}
              onSelect={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  toiletType: common.toiletTypes.find((i) => i.id === e),
                });
              }}
            />
          </div>
          <div className="col-md-6">
            <InputSelect
              label={"Bếp"}
              input={getKichentType()}
              flex={true}
              value={apartment.apartmentDetail?.kitchenType?.id}
              onSelect={(e) => {
                onChangeApartment("apartmentDetail", {
                  ...apartment.apartmentDetail,
                  kitchenType: common.kitchenTypes.find((i) => i.id === e),
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="editer-description back-ground">
        <EditorComponent
          value={apartment.apartmentDetail?.description || ""}
          onChange={(e) => {
            onChangeApartment("apartmentDetail", {
              ...apartment.apartmentDetail,
              description: e,
            });
          }}
        />
      </div>
      <div className="location-near back-ground">
        <div className="label-text">Địa điểm lân cận</div>
        <SearchFilterInput input={getLocation()} onSelect={addLocationNear} />
        <div className="location-near-list d-block">
          {apartment?.near?.map((item, index) => {
            if (item) {
              return (
                <ChipLabel
                  label={item.location?.name}
                  onDelete={() => {
                    removeLocationNear(item);
                  }}
                />
              );
            }
          })}
        </div>
      </div>
      <div className="time-post back-ground">
        <InputSelect
          margin={true}
          label="Thời gian đăng bài"
          input={dataPostPrice}
          value={apartment.pricePost?.id}
          onSelect={(e) => {
            onChangeApartment(
              "pricePost",
              dataPostPrice.find((i) => i.id === e)
            );
          }}
        />
        {apartment.pricePost ? (
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
        ) : null}
      </div>
      <div style={{ float: "right" }}>
        <Button className="button btn btn-primary " onClick={createApartment}>
          {apartment.id ? "Cập Nhật" : "Lưu"}
        </Button>
        <Button
          className="button btn btn-primary"
          variant="success"
          onClick={onClear}
        >
          Tạo mới
        </Button>
      </div>
    </div>
  );
};
