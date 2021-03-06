import API from "../..";
import { condition, ConditionDto } from "../apartment/dto/condtion";
const baseUrl = "/search";
const search = (input = condition as ConditionDto) => {
  return API.get(baseUrl, { params: input });
};
const getCountByType = () => {
  return API.get(baseUrl + "/listCountByType");
};
const getCountByDistrict = () => {
  return API.get(baseUrl + "/listCountByDistrict");
};
const getApartmentForUser = (conditionSearch:any) => {
  return API.get(`${baseUrl}/user`, {params: conditionSearch});
};
export const SearchAPI = { search, getApartmentForUser, getCountByType, getCountByDistrict };
